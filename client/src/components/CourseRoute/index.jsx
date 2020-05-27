import React, { useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import API from "../../utils/API";

const CourseRoute = ({ component: RouteComponent, match, location, ...rest }) => {
    const queryMap = location.search.substr(1).split("&").reduce((map, pair) => {
        const keyPair = pair.split("=");
        map[keyPair[0]] = keyPair[1];
        return map;
    }, {});

    const courseId = location.pathname.split("/").pop();

    // Field to check whether user is verified
    const [verified, setVerified] = useState(false);
    const [pending, setPending] = useState(true);
    
    useEffect(() => {
        const verifyInvite = async () => {
            if ("inviteid" in queryMap) {
                try {
                    console.log("ya yeet");
                    const data = await API.confirmVerificationLink(courseId, queryMap["inviteid"]);
                    console.log(data);
                    await API.addToCourse(courseId);
                    setVerified(true);
                    setPending(false);
                    window.alert("You have been added to the class!");
                } catch (e) {
                    console.log(e);
                    // window.alert("Invitation link is not valid");
                    // setPending(false);
                }
            } else {
                // setPending(false);
            }
        }

        verifyInvite();
    }, []);

    return (
        <Route 
            {...rest}
            render={routeProps => 
                pending ? <h1>Verifying Invitation Link</h1> 
                  : verified ? <Redirect to={`course/${courseId}`} />
                             : <Redirect to="/" />
            }
        />
    )
};

export default CourseRoute;