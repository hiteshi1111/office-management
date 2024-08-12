import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Registration from './pages/registration';
import { Provider } from "react-redux";
import store from './store';
import Login from './pages/login';
import SuperAdminLogin from './pages/superAdmin/login'
import SuperAdminDashboard from './pages/superAdmin/dashboard'
import AdminRoute from './protectedRouting/admin';
import NotFound from './pages/404';
import Events from './pages/common/events';
import Employees from './pages/admin/employees';
import Chat from './pages/common/chat';
import Account from './pages/common/account';
import Admins from './pages/superAdmin/admins';
import SuperAdminRoute from './protectedRouting/superadmin';
import DefaultRoute from './protectedRouting/employee';
import Permissions from './pages/admin/permissions';
import Contact from './pages/contact';
import Plans from './pages/superAdmin/plans';
import Settings from './pages/common/settings';
import LoggedInRoute from './protectedRouting/loggedIn';
import OurTeam from './pages/ourTeam';
import Tasks from './pages/common/tasks';
import Enquiries from './pages/superAdmin/enquiries';
import Notes from './pages/common/notes';

function App() {
  console.log("App component rendering"); // Logging for debugging
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='*' element={<NotFound />} />
          <Route path="/" exact element={<Home />} />
          <Route path='/mastermind/login' element={<SuperAdminLogin />} />    
          <Route path='/contact-us' element={<Contact />} />
          <Route path='/our-team' element={<OurTeam />} />

          <Route element={<LoggedInRoute />}>
            <Route path='/registration' element={<Registration />} />
            <Route path='/login' element={<Login />} />
          </Route>
          
          {/* FOR ALL SUPERADMIN LOGIN */}
          <Route element={<SuperAdminRoute />}>
            <Route path='/mastermind/dashboard' element={<SuperAdminDashboard />} />
            <Route path='/mastermind/subscribers' element={<Admins />} />
            <Route path='/mastermind/plans' element={<Plans />} />
            <Route path='/mastermind/settings' element={<Settings />} />
            <Route path='/mastermind/enquiries' element={<Enquiries />} />
          </Route>

          {/* FOR ALL ROUTES AFTER LOGIN */}
          <Route element={<DefaultRoute />}>
            <Route path='/events' element={<Events />} />
            <Route path='/account' element={<Account />} />
            <Route path='/chat' element={<Chat />} />
            <Route path='/notes' element={<Notes />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/tasks' element={<Tasks />} />
          </Route>

          {/* FOR ADMIN LOGIN */}
          <Route element={<AdminRoute />}>
            <Route path='/permissions' element={<Permissions />} />
            <Route path='/employees' element={<Employees />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;