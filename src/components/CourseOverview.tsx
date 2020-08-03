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


const CourseOverview = () => {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<ParsedCourseOverview[]>([]);

  const [courseCategory, setCourseCategory] = useState(CourseCategory.CLUB);

  const apiContext = useContext(Context.Api);

  useEffect(() => {
    setLoading(true);

    apiContext
      .getCourses()
      .then((c) => {
        setCourses(c.map(parseCourse).sort(defaultPublicCourseSort));
      })
      .catch((e) => {
        // message.error('Kurse konnten nicht geladen werden.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [apiContext]);

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

  const CoursesWithTag = (tag: { name: string, identifier: string }) => {
    const feasibleCourses = courses.filter(c => c.tags.find(t => t.id === tag.identifier));

    const tagDisplay =
      <Text className={classes.tagDisplay}>
        { tag.name }
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

  const coursesWithTag =
    tags
    .get(courseCategory)
    .map(t => CoursesWithTag(t))
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
