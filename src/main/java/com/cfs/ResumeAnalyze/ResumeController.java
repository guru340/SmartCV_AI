package com.cfs.ResumeAnalyze;

import org.apache.tika.Tika;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.openai.OpenAiChatModel;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@CrossOrigin("http://localhost:5173/")
@RequestMapping("/api/resume")
public class ResumeController {

    private final ChatClient chatClient;
    private final Tika tika = new Tika();

    public ResumeController(OpenAiChatModel openAiChatModel) {
        this.chatClient = ChatClient.create(openAiChatModel);
    }

    @PostMapping("/analyze")
    public Map<String, Object> analyser(@RequestParam("file") MultipartFile file) throws Exception {
        String content = tika.parseToString(file.getInputStream());

        String prompt = """
                Analyze this resume text:
                %s

                1. Extract key Skills
                2. Rate Overall resume quality (1-10)
                3. Suggest 3 improvements

                Reply ONLY with valid JSON, no extra text, no markdown fences:
                {
                  "skills": ["skill1", "skill2"],
                  "overallScore": 7,
                  "improvements": ["improvement1", "improvement2", "improvement3"]
                }
                """.formatted(content);

        String aiResponse = chatClient.prompt().user(prompt).call().content();
        return Map.of("answer", aiResponse);
    }

    @PostMapping("/ats-check")
    public Map<String, Object> analyzeAts(
            @RequestParam("file") MultipartFile file,
            @RequestParam("jd") String jobDescription) throws Exception {

        String resumeText = tika.parseToString(file.getInputStream());

        String prompt = """
                You are an expert ATS Analyser. Compare the resume and job description below.

                Resume:
                %s

                ----
                Job Description:
                %s
                ----

                Reply ONLY with valid JSON, no extra text, no markdown fences:
                {
                  "atsScore": 7,
                  "matchedKeywords": ["keyword1", "keyword2"],
                  "missingKeywords": ["keyword3", "keyword4"],
                  "summary": "Short paragraph about the match"
                }
                """.formatted(resumeText, jobDescription);

        String aiResponse = chatClient.prompt().user(prompt).call().content();
        return Map.of("answer", aiResponse);
    }
}