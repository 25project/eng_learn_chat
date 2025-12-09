package eng.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class GeminiConfig {
    
    //Gemini API 통신
    @Bean
    public WebClient.Builder webClientBuilder() {
        return WebClient.builder();
    }
}
