package com.example.dcodeweb1.house;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Data
public class House {

    public void setHouseId(long houseId) {
        this.houseId = houseId;
    }

    public String getLocation() {
        return location;
    }

    public int getHotPoint() {
        return hotPoint;
    }

    public void setHotPoint(int hotPoint) {
        this.hotPoint = hotPoint;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setpOwnerPhone(String pOwnerPhone) {
        this.pOwnerPhone = pOwnerPhone;
    }

    public void setCreateUser(Long createUser) {
        this.createUser = createUser;
    }

    public void setCreateTime(LocalDateTime createTime) {
        this.createTime = createTime;
    }

    public void setUpdateUser(Long updateUser) {
        this.updateUser = updateUser;
    }

    public void setUpdateTime(LocalDateTime updateTime) {
        this.updateTime = updateTime;
    }

    @Getter
    @TableId
    private long houseId;

    private String location;

    private String houseType;

    private int floor;

    private double square; // 平方米

    private double price; // 万元

    private int yearBuilt;

    private int hotPoint; // 热门 ‘0’不热门，‘1’热门

    @Getter
    private int status; // ‘0’正在出售，‘1’已售，‘2’待审核，‘9’锁定

    private String propertyOwner;

    @Getter
    private String pOwnerPhone;

    private Long createUser;

    @Getter
    @TableField(fill = FieldFill.UPDATE)
    private LocalDateTime createTime;

    private Long updateUser;

    @Getter
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}
