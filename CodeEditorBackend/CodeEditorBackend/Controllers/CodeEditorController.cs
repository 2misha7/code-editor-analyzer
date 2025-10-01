using DiffMatchPatch;
using Microsoft.AspNetCore.Mvc;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace CodeEditorBackend.Controllers;

[ApiController]
public class CodeEditorController(IHttpClientFactory httpClientFactory, IConfiguration configuration) : ControllerBase
{
    private readonly IHttpClientFactory _httpClientFactory = httpClientFactory;
    private readonly string _apiKey = configuration["GEMINI_API_KEY"];
    private readonly string _endpointUrl = configuration["GOOGLE_COMPATIBILITY_ENDPOINT"] + "chat/completions";

    [HttpPost("report")]
    public async Task<IActionResult> GeneratePrompt([FromBody] CodeAnalysisRequest request)
    {
        var dmp = new diff_match_patch();
        var diffs = dmp.diff_main(request.InitialCode ?? "", request.ModifiedCode ?? "");
        dmp.diff_cleanupSemantic(diffs);
        var diffString = new StringBuilder();
        foreach (var diff in diffs)
        {
            switch (diff.operation)
            {
                case Operation.INSERT: diffString.AppendLine("+ " + diff.text.Replace("\n", "\n+ ")); break;
                case Operation.DELETE: diffString.AppendLine("- " + diff.text.Replace("\n", "\n- ")); break;
                case Operation.EQUAL: diffString.AppendLine("  " + diff.text.Replace("\n", "\n  ")); break;
            }
        }

        var systemMessage = "You are an expert code reviewer. Analyze the following code changes and provide actionable improvement suggestions. Focus on readability, maintainability, and best practices.";
        var userMessage = $"Please analyze the following code diff:\n\n```diff\n{diffString}\n```";

        var fullPromptForDisplay = $"{systemMessage}\n\n{userMessage}";

        var requestBody = new
        {
            model = "gemini-2.5-flash",
            messages = new[]
        {
                    new { role = "user", content = fullPromptForDisplay }
                }
        };

        var client = _httpClientFactory.CreateClient();


        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);
        client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));


        string jsonBody = JsonSerializer.Serialize(requestBody);
        var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

        var response = await client.PostAsync(_endpointUrl, content);
        var responseString = await response.Content.ReadAsStringAsync();

        using var jsonDoc = JsonDocument.Parse(responseString);
        var chatContent = jsonDoc.RootElement
                                 .GetProperty("choices")[0]
                                 .GetProperty("message")
                                 .GetProperty("content")
                                 .GetString();

        return Ok(new { content = chatContent });
    }
}

public class CodeAnalysisRequest
{
    public string? InitialCode { get; set; }
    public string? ModifiedCode { get; set; }
}
