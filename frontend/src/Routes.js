import React from 'react';
import { Route, Switch } from 'react-router';
import Signin from './Sign/Signin';
import SignUp from './Sign/SignUp';
import Header from './Header/header';
import Profile from './Profile/Profile';
import CreatePost from './Home/CreatePost';
import UserProfile from './Profile/userProfile';
import Subscribeduser from './Profile/Subsribeuser';
import UserRoute from './Sign/UserRoutes';

const Routes = () => {
    return (
        <div>
        <Header/>
     <Switch>
         
         <Route exact path ="/signup" component={SignUp}/>
         <Route exact path ="/login" component={Signin}/>
         <UserRoute exact path="/profile" component={Profile}/>
         <UserRoute path="/profile/:userid" component={UserProfile}/>       
         <UserRoute exact path ="/newpost" component={CreatePost}/>
         <UserRoute exact path ="/" component={Subscribeduser}/>
         
         
     </Switch>
     </div>
    )
}

export default Routes
