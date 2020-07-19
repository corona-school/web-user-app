import React, { useState } from "react";
import { Radio } from "antd";
import {Text} from "./Typography";

import { CourseCategory } from "../types/Course";
import classes from "./CourseOverview.module.scss";
import Icons from "../assets/icons/index";


const CourseOverview = () => {
  const [courseCategory, setCourseCategory] = useState(CourseCategory.CLUB);

  const CategoryButtons = () => {
    return (
      <Radio.Group defaultValue={courseCategory} className={classes.radio}>
        <Radio.Button value={CourseCategory.CLUB} className={classes.button}>
            <Icons.Club className={classes.icon}/>
            <Text className={classes.buttonText}>Sommer-AGs</Text>
        </Radio.Button>
        <Radio.Button value={CourseCategory.REVISION} className={classes.button}>
          <Icons.Revision className={classes.icon}/>
          <Text className={classes.buttonText}>Repetitorium</Text>
        </Radio.Button>
        <Radio.Button value={CourseCategory.COACHING} className={classes.button}>
          <Icons.Coaching className={classes.icon}/>
          <Text className={classes.buttonText}>Lerncoaching</Text>
        </Radio.Button>
      </Radio.Group>
    )
  }

  const OverviewHeader = () => {
    return (
      <div className={classes.header}>
        <CategoryButtons />
      </div>
    )
  }

  return (
    <OverviewHeader />
  )
}

export default CourseOverview;
