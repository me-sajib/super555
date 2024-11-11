import React, { useEffect, useState } from "react";
import "./Home.css";
import { useNavigate } from "react-router-dom";
import { determineDay, formatCountdown, formatTimeAM } from "../../Utils/time";
import BottomNavigationComponent from "../BottomNavigation/BottomNavigation";
import { BASE_URL } from "../../API/Constants";
import checkIcon from "../../Assets/checked.png";
import Carousel from "react-material-ui-carousel";
import { shouldShowContest } from "../../Utils/Contest";
import slider4 from "../../Assets/slider4.gif";
import CustomAlert from "../CustomAlert/CustomAlert";
import PullToRefresh from "react-simple-pull-to-refresh";
import ProfileDrawer from "../ProfileDrawer/ProfileDrawer";

var items = [slider4];

function Home() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [apiCalled, setApiCalled] = useState(false);
  const [upcomingContests, setUpcomingContests] = useState([]);
  const [sliderImages, setSliderImages] = useState([]);
  const uid = localStorage.getItem("user_id");

  const openEachTicketContainer = (ticketId, cancelled, cancelledReason) => {
    if (cancelled) {
      setErrorMessage("Contest has been cancelled due to " + cancelledReason);
      setOpenErrorAlert(true);
      return;
    }
    navigate(`/contest-page/${ticketId}`);
  };

  const handleUserData = (coins) => {
    try {
      const parsedCoins = parseFloat(coins);

      if (!isNaN(parsedCoins)) {
        console.log("Coins : ", parsedCoins);
        localStorage.setItem("user_coins", parsedCoins);
      }
    } catch (error) {
      console.error("Error handling user data:", error);
    }
  };

  const handleSliderImages = (imagesList) => {
    let sliderList = [];
    imagesList.forEach((image) => {
      if (image.length > 0) {
        sliderList.push(image);
      }
    });
    setSliderImages(sliderList);
  };

  const getPendingTickets = () => {
    setLoading(true);
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    };

    fetch(`${BASE_URL}/api/user/contests/new/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          setLoading(false);
          const list = data.data.upcomingContests;
          setUpcomingContests(list);
          handleUserData(data.data.user.coins);
          setApiCalled(true);
          handleSliderImages(data.data.sliderImages);
        } else if (data.status === 500) {
          setLoading(false);
          handleUserData(data.data.user.coins);
        }
      })
      .catch((error) => { });
  };

  useEffect(() => {
    if (apiCalled) {
      getPendingTickets();
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])


  const [successMessage, setSuccessMessage] = useState("Success");
  const [errorMessage, setErrorMessage] = useState("Error");
  const [openSuccessAlert, setOpenSuccessAlert] = useState(false);
  const closeSuccessAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSuccessAlert(false);
  };
  const [openErrorAlert, setOpenErrorAlert] = useState(false);
  const closeErrorAlert = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenErrorAlert(false);
  };

  const onRefresh = () => {
    return new Promise((resolve, reject) => {
      const requestOptions = {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      };
      fetch(`${BASE_URL}/api/user/contests/new/${uid}`, requestOptions)
        .then((response) => response.json())
        .then((data) => {
          console.log("Data :", data);
          if (data.status === 200) {
            const list = data.data.upcomingContests;
            setUpcomingContests(list);
            setApiCalled(true);
            handleUserData(data.data.user.coins);
            resolve();
            setLoading(false);
          } else if (data.status === 500) {
            setLoading(false);
            handleUserData(data.data.user.coins);
            reject();
          }
        })
        .catch((error) => { });
    });
  };
  // const [open, setOpen] = React.useState(false);
  return (
    <div className="mb-20">
      <div class="w-full sticky top-0 z-[2]  min-h-[70px] flex justify-center items-center px-[10px] max-w-[430px] mx-auto">
        <div class="absolute top-0 left-0 w-full h-[80px]">
          <img
            src="https://super-5-wheat.vercel.app/img/header/ellipse.png"
            alt=""
            class="w-full h-full"
          />
        </div>
        <div class="w-full items-center mt-[8px] flex relative justify-between">
          <a class="mix-blend-color-dodge" href="/">
            <img
              src="https://super-5-wheat.vercel.app/img/logo/logo.jpeg"
              alt=""
              class="w-[132px]"
            />
          </a>
          <button class="px-3 rounded-full  h-[40px] items-center border border-white border-opacity-[25%] flex justify-center gap-2">
            <div class="coin-container" style={{ perspective: "1000px" }}>
              <svg
                class="coin "
                width="26"
                height="26"
                viewBox="0 0 26 26"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 26C20.1797 26 26 20.1797 26 13C26 5.8203 20.1797 0 13 0C5.8203 0 0 5.8203 0 13C0 20.1797 5.8203 26 13 26Z"
                  fill="#FED056"
                ></path>
                <path
                  d="M13.0001 23.5929C18.8504 23.5929 23.593 18.8503 23.593 13C23.593 7.14962 18.8504 2.40698 13.0001 2.40698C7.14974 2.40698 2.4071 7.14962 2.4071 13C2.4071 18.8503 7.14974 23.5929 13.0001 23.5929Z"
                  fill="#FEB635"
                ></path>
                <path
                  d="M23.593 13C23.593 18.8398 18.8399 23.593 13.0001 23.593C11.0958 23.593 9.31335 23.0902 7.7696 22.2066C9.19148 22.9176 10.7962 23.3188 12.4923 23.3188C18.3321 23.3188 23.0852 18.5656 23.0852 12.7258C23.0852 8.79024 20.9219 5.34727 17.7227 3.52422C21.2012 5.26094 23.593 8.85117 23.593 13ZM13.7212 2.90469C15.8083 2.90469 17.7532 3.51406 19.3884 4.55508C17.611 3.21445 15.3969 2.41211 13.0001 2.41211C7.16023 2.41211 2.4071 7.16016 2.4071 13.0051C2.4071 16.773 4.38757 20.0941 7.36335 21.9629C4.79382 20.0281 3.1282 16.9559 3.1282 13.4977C3.1282 7.65781 7.88132 2.90469 13.7212 2.90469Z"
                  fill="#FC9924"
                ></path>
                <path
                  d="M14.0106 8.65313L14.7926 11.0551C14.8891 11.3496 15.1684 11.5527 15.4782 11.5527H18.002C18.6977 11.5527 18.9922 12.4465 18.4235 12.8578L16.3872 14.3355C16.1333 14.5184 16.0266 14.8434 16.1282 15.143L16.9102 17.5449C17.1286 18.2102 16.3618 18.7637 15.8032 18.3523L13.7618 16.8695C13.5079 16.6867 13.1676 16.6867 12.9137 16.8695L10.8723 18.3523C10.3036 18.7637 9.54692 18.2102 9.76528 17.5449L10.5473 15.143C10.6438 14.8484 10.5372 14.5184 10.2883 14.3355L8.22661 12.8527C7.65786 12.4414 7.95239 11.5477 8.6481 11.5477H11.1719C11.4817 11.5477 11.761 11.3445 11.8575 11.05L12.6395 8.64805C12.8528 7.98789 13.7973 7.98789 14.0106 8.65313Z"
                  fill="#FC9924"
                ></path>
                <path
                  d="M13.3657 8.0082L14.1477 10.4102C14.2442 10.7047 14.5235 10.9078 14.8333 10.9078H17.3571C18.0528 10.9078 18.3473 11.8016 17.7786 12.2129L15.7372 13.6957C15.4833 13.8785 15.3766 14.2035 15.4782 14.5031L16.2602 16.9051C16.4786 17.5703 15.7118 18.1238 15.1532 17.7125L13.1118 16.2297C12.8579 16.0469 12.5177 16.0469 12.2637 16.2297L10.2071 17.7125C9.63835 18.1238 8.88171 17.5703 9.10007 16.9051L9.88211 14.5031C9.97859 14.2086 9.87195 13.8785 9.62312 13.6957L7.58171 12.2129C7.01296 11.8016 7.3075 10.9078 8.0032 10.9078H10.527C10.8368 10.9078 11.1161 10.7047 11.2126 10.4102L11.9946 8.0082C12.2028 7.34297 13.1473 7.34297 13.3657 8.0082Z"
                  fill="#FED056"
                ></path>
              </svg>
            </div>
            <span class="text-[18px] leading-1 text-white font-semibold">
              {localStorage.getItem("user_coins") || 0}
            </span>
          </button>
        </div>
      </div>

      <div className="mt-5 px-3">
        {sliderImages.length > 0 ? (
          <Carousel>
            {sliderImages.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        ) : (
          <Carousel>
            {items.map((item, i) => (
              <Item key={i} item={item} />
            ))}
          </Carousel>
        )}
      </div>

      <BottomNavigationComponent />
      <CustomAlert
        successMessage={successMessage}
        errorMessage={errorMessage}
        openSuccessAlert={openSuccessAlert}
        closeSuccessAlert={closeSuccessAlert}
        openErrorAlert={openErrorAlert}
        closeErrorAlert={closeErrorAlert}
      />
      <div class="px-[10px]">
        <h2 class="flex my-2 text-[16px] font-semibold text-[#181818]">
          Upcoming Matches
        </h2>
        {loading ? (
          <div class="flex items-center justify-center mt-4">
            <div class="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-[#ed5311]"></div>
          </div>
        ) : (
          <PullToRefresh onRefresh={onRefresh} pullingContent={""}>
            <div class="flex flex-col gap-[10px] w-full">
              {upcomingContests.length > 0 &&
                upcomingContests.map((ticket) => {
                  if (shouldShowContest(ticket.startDate)) {
                    return (
                      <div
                        className="cursor-pointer"
                        onClick={() =>
                          openEachTicketContainer(
                            ticket._id,
                            ticket.cancelled,
                            ticket.cancelledReason
                          )
                        }
                        key={ticket._id}
                      >
                        <div class="rounded-[20px] overflow-hidden border shadow-sm bg-white border-[#E7E7E7]">
                          <div class="h-[33px]  flex justify-center items-center px-3">
                            <div class="flex w-full items-center justify-between">
                              <span class="text-[12px] flex items-center gap-1 font-normal text-gray-600">
                                {ticket?.description}
                              </span>

                              {/* <p class="text-[14px] font-medium flex">
                                                                    <span class="w-[60px] block">
                                                                        Starts in
                                                                    </span>
                                                                    <span class="text-color font-semibold w-[68px] block"> {ticket?.countdown}</span>
                                                                </p> */}
                              {ticket.submissions &&
                                ticket.submissions.length > 0 && (
                                  <div className="bg-[#ED5311] rounded-full text-white text-[12px]">
                                    <div className="flex items-center justify-center">
                                      <p className="text-base font-light px-2 !text-[12px]">
                                        Joined
                                      </p>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                          <div class="px-[10px]">
                            <div class="line-gradient h-[1px] w-full"></div>
                          </div>

                          <div>
                            <div class="px-3 pb-[6px] pt-[12px]">
                              <div class="flex justify-between items-start gap-2">
                                <div class="flex flex-col gap-1 items-start">
                                  <div className="flex gap-3 items-center">
                                    <img
                                      class="w-[48px] h-[44px] rounded-full"
                                      alt=""
                                      src={
                                        ticket?.teamOneLogo ||
                                        "https://i.postimg.cc/1tt7SQYT/flag2.jpg"
                                      }
                                    />
                                    <span class="text-[18px] font-bold text-black">
                                      {ticket?.teamOneShortName}
                                    </span>
                                  </div>
                                  <p class="text-[12px] font-light text-gray-500 ml-1">
                                    {ticket?.teamOne}
                                  </p>
                                </div>

                                <div class="flex flex-col gap-1 items-center">
                                  <span
                                    class={`text-[12px] px-2 py-1 flex items-center justify-center text-center  rounded-md  ${formatCountdown(
                                      ticket?.startDate
                                    )?.includes("Tomorrow")
                                      ? "text-[#FC1010] bg-[#F3E0DA]"
                                      : "text-[#F05919] bg-[#FFBEA9] font-medium"
                                      }`}
                                  >
                                    {formatCountdown(ticket?.startDate)}{" "}
                                  </span>
                                  {/* <span class="text-[12px] px-2 py-1 flex items-center justify-center text-center bg-[#FFBEA9] text-[#F05919] rounded-md">{determineDay(ticket?.startDate)?.includes("Tomorrow") ? "Tomorrow" : formatTimeAM(ticket?.startDate, "")} </span> */}
                                  <h2 class="text-[13px] font-normal">
                                    {determineDay(ticket?.startDate)}
                                  </h2>
                                </div>

                                <div class="flex flex-col gap-1 justify-end items-end">
                                  <div className="flex gap-3 items-center">
                                    <span class="text-[15px] font-bold text-black">
                                      {ticket?.teamTwoShortName}
                                    </span>
                                    <img
                                      class="w-[48px] h-[44px] rounded-full"
                                      alt=""
                                      src={
                                        ticket?.teamTwoLogo ||
                                        "https://i.postimg.cc/1tt7SQYT/flag2.jpg"
                                      }
                                    />
                                  </div>
                                  <p class="text-[12px] font-light text-gray-500 text-center mr-1">
                                    {ticket?.teamTwo.length > 15
                                      ? ticket?.teamTwo.slice(0, 22) + "..."
                                      : ticket?.teamTwo}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          {ticket?.tagline && (
                            <div class="bg-[#FFF4EF] flex justify-center items-center h-[33px]">
                              <span class="text-[#181818] font-semibold text-[13px]">
                                {ticket?.tagline}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                })}
            </div>
          </PullToRefresh>
        )}
        {!loading && upcomingContests.length === 0 && (
          <>
            <img className="h-20 mt-8" src={checkIcon} alt="" />
            <p className="text-2xl text-gray-500 mt-2">No Contests found</p>
          </>
        )}
      </div>
    </div>
  );
}

export default Home;

function Item(props) {
  if (props.item.length > 0) {
    return (
      <div class="w-full h-[146px] bg-[#213743] rounded-[10px] relative">
        <img
          src="https://super-5-wheat.vercel.app/img/banner/banner-img.png"
          alt=""
          class="w-[119px] z-[3] absolute bottom-0 right-4 h-[126px] object-contain"
        />
        <div class="flex flex-col pl-3 w-full relative z-10">
          <div class="pt-1">
            <span class="px-1 py-[2px] rounded-md bg-white text-black text-[12px] font-semibold">
              Promo
            </span>
          </div>
          <div class="w-[220px] flex flex-col">
            <h3 class="text-[#ED5311] font-bold text-[20px]">
              Win IPhone Free
            </h3>
            <div class="flex flex-col">
              <p class="text-[floralwhite] leading-[1.2] font-semibold text-[14px]">
                Join our Free contest &amp; Predict 5 questions*
              </p>
              <a
                class="banner-btn-gradient flex justify-center items-center mt-2 py-2 text-white w-[173px] font-semibold rounded-[8px] text-[12px]"
                href="/how-to-play"
              >
                LEARN HOW TO PLAY
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
