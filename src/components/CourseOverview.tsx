import React, {useContext, useEffect, useState} from "react";
import { Radio, Empty } from "antd";
import {Text} from "./Typography";

import {CourseCategory, ParsedCourseOverview} from "../types/Course";
import classes from "./CourseOverview.module.scss";
import Icons from "../assets/icons/index";
import {CourseIntroductionText} from "../assets/courseIntroduction";
import {tags} from "./forms/CreateCourse";
import {
  defaultPublicCourseSort,
  firstLectureOfSubcourse,
  parseCourse
} from "../utils/CourseUtil";
import Context from "../context";
import moment from "moment";
import {MiniCourseCard} from "./cards/MiniCourseCard";


const CourseOverview = (courses: ParsedCourseOverview[]) => {
  const [courseCategory, setCourseCategory] = useState(CourseCategory.CLUB);

  const CategoryButtons = () => {
    return (
      <Radio.Group defaultValue={courseCategory} onChange={e => setCourseCategory(e.target.value)} className={classes.radio} buttonStyle="solid">
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

  const CoursesFrame = (feasibleCourses: ParsedCourseOverview[], tagName: string) => {
    const tagDisplay =
      <Text className={classes.tagDisplay}>
        { tagName }
      </Text>

    const scrollFrame =
      <div className={classes.scrollFrame}>
        { feasibleCourses.map(c => MiniCourseCard(c)) }
      </div>

    if (feasibleCourses.length > 0) {
      return (
        <div className={classes.coursesWithTag}>
          { tagDisplay }
          { scrollFrame }
        </div>
      )
    }
    else {
      return undefined;
    }
  }

  const CourseFrameWithTag = (courseCategory: CourseCategory, tag: {identifier: string, name: string}) => {
    const feasibleCourses =
      courses
        .filter(c => c.category === courseCategory)
        .filter(c => c.tags.find(t => t.id === tag.identifier));
    return (
      CoursesFrame(feasibleCourses, tag.name)
    )
  }

  const MiscCourseFrame = (courseCategory: CourseCategory) => {
    const feasibleCourses =
      courses
        .filter(c => c.category === courseCategory)
        .filter(c => c.tags.filter(t => tags.get(courseCategory).map(tag => tag.identifier).indexOf(t.id) !== -1).length === 0)
    return (
      CoursesFrame(feasibleCourses, "Sonstige")
    )
  }

  const coursesWithTag =
    tags
      .get(courseCategory)
      .map(t => CourseFrameWithTag(courseCategory, t))
      .concat(MiscCourseFrame(courseCategory))
      .filter(container => container !== undefined);

  return (
    <div className={classes.container}>
      <OverviewHeader />
      <div className={classes.main}>
        { coursesWithTag.length > 0 ?
          coursesWithTag :
          <Empty
            description="Im Moment sind in dieser Kategorie keine Kurse verfügbar."
            style={{ marginBottom: "35px"}}
          />
        }
      </div>
    </div>

  )
}

export default CourseOverview;
