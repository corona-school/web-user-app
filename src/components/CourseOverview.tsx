import React, { useState } from "react";
import { Radio } from "antd";
import {Text} from "./Typography";

import { CourseCategory } from "../types/Course";
import classes from "./CourseOverview.module.scss";
import Icons from "../assets/icons/index";
import {CourseIntroductionText} from "../assets/courseIntroduction";


const CourseOverview = () => {
  const [courseCategory, setCourseCategory] = useState(CourseCategory.CLUB);

  const CategoryButtons = () => {
    return (
      <Radio.Group defaultValue={courseCategory} className={classes.radio}>
        <Radio.Button value={CourseCategory.CLUB} className={classes.button}>
            Sommer-AGs
        </Radio.Button>
        <Radio.Button value={CourseCategory.REVISION} className={classes.button}>
          Repetitorium
        </Radio.Button>
        <Radio.Button value={CourseCategory.COACHING} className={classes.button}>
          Lerncoaching
        </Radio.Button>
      </Radio.Group>
    )
  }

  const OverviewHeader = () => {
    return (
      <div className={classes.header}>
        <CategoryButtons />
        <Text style={{position: "absolute", width: "862px", height: "63px", top: "107px", fontFamily: "Roboto, sans-serif", fontStyle: "normal", fontWeight: "normal", fontSize: "18px", lineHeight: "21px", color: "#000000"}}>
          { CourseIntroductionText }
        </Text>
      </div>
    )
  }

  return (
    <OverviewHeader />
  )
}

export default CourseOverview;
