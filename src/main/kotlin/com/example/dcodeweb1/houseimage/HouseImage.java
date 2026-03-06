package com.example.dcodeweb1.houseimage;

import com.baomidou.mybatisplus.annotation.TableId;
import lombok.Data;
import lombok.Getter;

@Data
public class HouseImage {

    public void setId(long id) {
        this.id = id;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getImageName() {
        return imageName;
    }

    public void setImageName(String imageName) {
        this.imageName = imageName;
    }

    @TableId
    private long id;

    private String location;

    private String imageName;
}
