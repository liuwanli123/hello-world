package com.bancai.util.risk.easyexcel;
import com.alibaba.excel.annotation.ExcelIgnore;
import com.alibaba.excel.annotation.ExcelProperty;
import lombok.Data;

import java.util.Date;

@Data
public class Oldpanel_Inbound {


    /**
     * 忽略这个字段
     */
    @ExcelIgnore
    private String ignore;

}
