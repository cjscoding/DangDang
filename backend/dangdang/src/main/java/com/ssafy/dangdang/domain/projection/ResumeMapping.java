package com.ssafy.dangdang.domain.projection;

import com.ssafy.dangdang.domain.ResumeQuestion;

import java.util.List;

public interface ResumeMapping {

    Long getId();

    List<ResumeQuestion> getResumeQuestionList();
}
