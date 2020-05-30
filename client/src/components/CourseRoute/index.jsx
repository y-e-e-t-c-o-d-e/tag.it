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

    /**
     * 3 states to account for:
     *   1) User is in the class --> redirect to normal course page without query params
     *   2) User is NOT in the class --> check if invite id exists
     */
    
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

        // Check if user is in the class
        

        verifyInvite();
    }, []);

    return (
        <Route 
            {...rest}
            render={routeProps => 
                pending ? <h1>Verifying Invitation Link</h1> 
                    
                        : verified ? <Redirect to={location.pathname} />
                             : <Redirect to="/" />
            }
        />
    )
};

export default CourseRoute;