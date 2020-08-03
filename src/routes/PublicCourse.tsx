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
        <div className={classes.weVsVirusLogo} >
          <Icons.WirVsVirusLogo  />
        </div>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <Header />
      <div className={classes.main}>
        <CourseOverview />
      </div>
    </div>
  )
}

export default PublicCourse;
