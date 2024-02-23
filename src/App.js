import "./App.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import SignUpPage from "./pages/SignUp";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useDispatch } from "react-redux";
import { setUser } from "./redux/Slices/userSlice";
import PrivateRoutes from "./components/Common/PrivateRoutes";
import CreateAPodcast from "./pages/CreateAPodcast";
import PodcastsPage from "./pages/Podcasts";
import PodcastDetails from "./pages/PodcastDetails";
import CreateEpisode from "./pages/CreateEpisode";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const unsubscribeSnapshot = onSnapshot(
          doc(db, "users", user.uid),
          (userDoc) => {
            if (userDoc.exists()) {
              const userData = userDoc.data();
              dispatch(
                setUser({
                  name: userData.name,
                  email: userData.email,
                  uid: userData.uid,
                })
              );
            }
          },
          (error) => {
            console.log("Error fetching user data: ", error);
          }
        );

        return () => {
          unsubscribeSnapshot();
        };
      }
    });
    return () => {
      unsubscribeAuth();
    };
  }, [dispatch]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<SignUpPage />} />
        <Route element={<PrivateRoutes />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-a-podcast" element={<CreateAPodcast />} />
          <Route path="/podcasts" element={<PodcastsPage />} />
          <Route path="/podcasts/:id" element={<PodcastDetails />} />
          <Route
            path="/podcasts/:id/create-episode"
            element={<CreateEpisode />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
