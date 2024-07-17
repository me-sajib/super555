import "./App.css";
import React from "react";
import {
	BrowserRouter,
	Routes,
	Route,
	Navigate,
	Outlet,
} from "react-router-dom";
import Home from "./Components/Home/Home";
import MyContests from "./Components/MyContests/MyContests";
import isAuthenticated from "./Auth/Authenticate";
import ViewLeaderboard from "./Components/ViewLeaderboard/ViewLeaderboard";
import ViewParticipants from "./Components/ViewParticipants/ViewParticipants";
import JoinContest from "./Components/JoinContest/JoinContest";
import Submissions from "./Components/Submissions/Submissions";
import ReviewContest from "./Components/ReviewContest/ReviewContest";
import ContestPage from "./Components/ContestPage/ContestPage";
import LiveContest from "./Components/LiveContest/LiveContest";
import CompletedContest from "./Components/CompletedContest/CompletedContest";
import UserProfile from "./Components/UserProfile/UserProfile";
import FAQs from "./Components/FAQs/FAQs";
import HelpAndSupport from "./Components/HelpAndSupport/HelpAndSupport";
import HowToPlay from "./Components/HowToPlay/HowToPlay";
import MyInfo from "./Components/MyInfo/MyInfo";
import QuizPage from "./Components/QuizPage/QuizPage";
import CoinHistory from "./Components/CoinHistory/CoinHistory";
import ReferAndEarn from "./Components/ReferAndEarn/ReferAndEarn";
import MyRewards from "./Components/MyRewards/MyRewards";
import CancelledContest from "./Components/CancelledContest/CancelledContest";
import LoginWithPhone from "./Components/LoginWithPhone/LoginWithPhone";
import LoginWithEmail from "./Components/LoginWithEmail/LoginWithEmail";
import Footer from "./Components/Footer";

function App() {
	const PrivateWrapper = () => {
		return <Outlet />;
		//  isAuthenticated() ? <Outlet /> :
		// <Navigate to="/login" />;
	};

	return (
		<BrowserRouter>
			<div className="">
				<Routes>
					<Route path="/login" element={<LoginWithPhone />} />
					<Route path="/mobile-login" element={<LoginWithPhone />} />
					<Route path="/email-auth" element={<LoginWithEmail />} />
					<Route element={<PrivateWrapper />}>
						<Route path="/" element={<Home />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/my-contests" element={<MyContests />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/join-contest/:id" element={<JoinContest />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/review-contest/:id" element={<ReviewContest />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/view-leaderboard/:id" element={<ViewLeaderboard />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route
							path="/view-participants/:id"
							element={<ViewParticipants />}
						/>
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/submissions/:id" element={<Submissions />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/contest-page/:id" element={<ContestPage />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/quiz-page/:id" element={<QuizPage />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/live-contest/:id" element={<LiveContest />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route
							path="/completed-contest/:id"
							element={<CompletedContest />}
						/>
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route
							path="/cancelled-contest/:id"
							element={<CancelledContest />}
						/>
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/profile" element={<UserProfile />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/faqs" element={<FAQs />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/help-and-support" element={<HelpAndSupport />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/how-to-play" element={<HowToPlay />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/my-info" element={<MyInfo />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/coin-history" element={<CoinHistory />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/my-info" element={<MyInfo />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/refer-and-earn" element={<ReferAndEarn />} />
					</Route>
					<Route element={<PrivateWrapper />}>
						<Route path="/my-rewards" element={<MyRewards />} />
					</Route>
				</Routes>
			</div>
		</BrowserRouter>
	);
}

export default App;
