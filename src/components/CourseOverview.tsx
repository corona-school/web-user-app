import React, { useState } from "react";
import { Radio } from "antd";
import {Text} from "./Typography";

import { CourseCategory } from "../types/Course";
import classes from "./CourseOverview.module.scss";
import Icons from "../assets/icons/index";
import {CourseIntroductionText} from "../assets/courseIntroduction";
import {tags} from "./forms/CreateCourse";


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
        <Text className={classes.headerText}>
          { CourseIntroductionText }
        </Text>
      </div>
    )
  }

  const CoursesWithTag = (tag: string) => {
    const tagDisplay =
      <Text className={classes.tagDisplay}>
        { tag }
      </Text>

    const scrollFrame =
      <div className={classes.scrollFrame}>

      </div>

    return (
      <div className={classes.coursesWithTag}>
        { tagDisplay }
        { scrollFrame }
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <OverviewHeader />
      <div className={classes.main}>
        { tags.get(courseCategory).map(t => CoursesWithTag(t.name)) }
      </div>
    </div>

  )
}

export default CourseOverview;
