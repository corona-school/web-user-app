import React from "react";
import { useAPIResult } from "../context/ApiContext";
import classes from "./Certificates.module.scss";

export default function Certificates() {
    const state = useAPIResult("getCertificates");

    if(state.loading)
        return (
            <div>loading ...</div>
        );

    return (
        <div>
            Certificates<br/>
            {JSON.stringify(state.value)}
        </div>
    );
}