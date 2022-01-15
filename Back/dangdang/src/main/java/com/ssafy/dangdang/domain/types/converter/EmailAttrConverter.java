package com.ssafy.dangdang.domain.types.converter;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import com.ssafy.dangdang.domain.types.Email;

@Converter(autoApply = true)
public class EmailAttrConverter implements AttributeConverter<Email, String> {

    public static final String sep = "@";

    @Override
    public String convertToDatabaseColumn(Email email) {
        if (email == null)
            return null;
        return email.getAccount() + sep + email.getDomain();
    }

    @Override
    public Email convertToEntityAttribute(String dbData) {
        if (dbData == null)
            return null;
        if (dbData.isEmpty() || dbData.isBlank())
            return null;
        String[] email = dbData.split(sep);
        return Email.builder()
                .account(email[0])
                .domain(email[1])
                .build();
    }

}
