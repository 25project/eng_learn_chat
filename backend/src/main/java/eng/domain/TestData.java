package eng.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "testdata")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class TestData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long testId;

    @JoinColumn(name = "user_id")
    private Long userId;

    private LocalDate date;  // yyyy-MM-dd 출력용

    // 필수 점수들(nullable = false)
    @Column(nullable = false)
    private Double wscore;   // 단어 점수

    @Column(nullable = false)
    private Double gscore;   // 문법 점수

    @Column(nullable = false)
    private Double vscore;   // 어휘 점수

    // 선택 점수: 비어 있어도 OK (nullable = true 기본값)
    private Double pscore;   // 발음 점수(선택)
}
