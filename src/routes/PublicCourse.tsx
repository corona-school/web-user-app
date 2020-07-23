import React from "react";
import CourseOverview from "../components/CourseOverview";
import classes from "./PublicCourse.module.scss";
import Icons from "../assets/icons";
import {Title} from "../components/Typography";

const PublicCourse = () => {
  const Header = () => {
    return (
      <div className={classes.header}>
        <div className={classes.logo}>
          <Icons.Logo />
          <Title className={classes.logoText} >
            Corona School
          </Title>
        </div>
        <Icons.WirVsVirusLogo />
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <Header />
      <CourseOverview />
    </div>
  )
}

export default PublicCourse;
