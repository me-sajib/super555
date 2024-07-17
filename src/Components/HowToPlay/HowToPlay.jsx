import React, { useEffect, useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../API/Constants";

function HowToPlay() {
  const navigate = useNavigate();
  const [howToPlayRules, setHowToPlayRules] = useState([]);
  const [activeSection, setActiveSection] = useState("select-match");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/settings/data/how_to_play`);
        if (response.ok) {
          const data = await response.json();
          if (data.status === 200) {
            setHowToPlayRules(data.data.settings.list);
          }
        } else {
          console.error("Error fetching data:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []); // Fetch data on component mount

  useEffect(() => {
    // Initialize active section based on the URL hash on mount
    const hash = window.location.hash.substring(1); // Remove the "#" from the hash
    if (hash && document.getElementById(hash)) {
      setActiveSection(hash);
    }
  }, []);

  // Function to handle scroll and update active section
  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight * 0.4;
    const sections = document.querySelectorAll(".sections");
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.clientHeight;
      const sectionId = section.id;
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        setActiveSection(sectionId);
      }
    });
  };

  useEffect(() => {
    // Add scroll event listener to update active section
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Only add/remove event listener on component mount/unmount

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <div>
      <div class="w-full sticky top-0 z-[2]  min-h-[70px] flex justify-center items-center px-1 max-w-[430px] mx-auto">
        <div class="absolute top-0 left-0 w-full h-[80px]">
          <img
            src="https://super-5-wheat.vercel.app/img/header/ellipse.png"
            alt=""
            class="w-full h-full"
          />
        </div>
        <div class="h-[70px] px-[10px] sticky z-[101] top-0 flex justify-center items-center w-full">
          <div class="absolute top-[22px] left-[10px]">
            <Link to="/">
              <svg width="27" height="28" viewBox="0 0 27 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 2L3 14.4138M3 14.4138L15 26M3 14.4138H27" stroke="white" stroke-width="3"></path>
              </svg>
            </Link>
          </div>
          <h2 class="text-[20px] leading-[1] text-center text-white font-bold">How to Play</h2>
        </div>
      </div>


      <div className="relative pb-[90px] px-[10px]">
        {/* Render sections */}

        <div className="translate-y-[38px] bg-white flex flex-col gap-2 drop-shadow-d1 rounded-[10px] p-[15px]">
          <h2 className="text-[#181818] leading-[1.2] font-bold text-[20px]">
            What is Super5
          </h2>
          <p className="text-[#000000] leading-[1.4] text-[14px] font-normal">
            Dummy text of the printing and typesetting industry. Lorem Ipsum
            has been the industry's standard.
          </p>
        </div>

        <div className="fixed bottom-0 left-0 w-full flex justify-center">
          <div className="max-w-[430px] w-full py-2 bg-[#fbfbfb]">
            <div className="flex relative px-3 justify-between">
              <img src="https://super-5-wheat.vercel.app/img/how-to-play/line.png" alt="" className="w-[88%] z-10 absolute top-4 left-[50%] translate-x-[-50%]" />
              <div className={`flex w-[70px] z-50 transition-all duration-300 steps-link flex-col justify-center items-center gap-1 ${activeSection === "select-match" ? "in-view" : " "}`}>
                <a class="w-[40px] shadow-md transition-all duration-300  bg-[#F8F8F8] tabs-filter flex justify-center items-center h-[40px] rounded-full" href="#select-match">
                  <span class="leading-[1] transition-all duration-300 font-bold text-primary">1</span>
                </a>
                <div class="text-[12px] w-[70px] text-center leading-[1.2] text-black font-bold">Select Match</div>
              </div>
              <div class={`flex w-[70px] z-50 transition-all duration-300 steps-link flex-col justify-center items-center gap-1 ${activeSection === "prediction-match" ? "in-view" : " "}`}>
                <a class="w-[40px] shadow-md bg-[#F8F8F8] transition-all duration-300 tabs-filter flex justify-center items-center h-[40px] rounded-full" href="#prediction-match">
                  <span class="leading-[1] transition-all duration-300 font-bold text-primary">2</span>
                </a>
                <div class="text-[12px] w-[70px] text-center leading-[1.2] text-black font-bold">Make Your Prediction</div>
              </div>
              <div class={`flex w-[70px] z-50 transition-all duration-300 steps-link flex-col justify-center items-center gap-1 ${activeSection === "free-contest" ? "in-view" : " "}`}>
                <a class="w-[40px] z-50 shadow-md transition-all duration-300 bg-[#F8F8F8] tabs-filter flex justify-center items-center h-[40px] rounded-full" href="#free-contest">
                  <span class="leading-[1] transition-all duration-300 font-bold text-primary">3</span>
                </a><div class="text-[12px] w-[70px] text-center leading-[1.2] text-black font-bold">Join Free Contest</div>
              </div>
              <div class={`flex w-[70px] z-50 transition-all duration-300 steps-link flex-col justify-center items-center gap-1 ${activeSection === "enjoy-match" ? "in-view" : " "}`}>
                <a class="w-[40px] shadow-md z-50 bg-[#F8F8F8] transition-all duration-300 tabs-filter flex justify-center items-center h-[40px] rounded-full" href="#enjoy-match">
                  <span class="leading-[1] transition-all duration-300 font-bold text-primary">4</span>
                </a><div class="text-[12px] w-[70px] text-center leading-[1.2] text-black font-bold">Enjoy Match</div>
              </div>
            </div>
          </div>
        </div>


        <div id="select-match" className="sections flex flex-col gap-6 pt-[90px]">
          <h2 className="text-[#181818] leading-[1.2] font-bold text-[20px]">Select a Match</h2>
          <p className="text-black leading-[1.2] text-[14px]">
            Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.
          </p>
          <img
            src="https://super-5-wheat.vercel.app/img/how-to-play/select-match.png"
            alt=""
            className="w-[223px] mx-auto"
          />
        </div>

        <div id="prediction-match" className="sections flex flex-col gap-6 pt-[90px]">
          <h2 className="text-[#181818] leading-[1.2] font-bold text-[20px]">Make Your Prediction</h2>
          <p className="text-black leading-[1.2] text-[14px]">
            Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.
          </p>
          <img
            src="https://super-5-wheat.vercel.app/img/how-to-play/select-match.png"
            alt=""
            className="w-[223px] mx-auto"
          />
        </div>

        <div id="free-contest" className="sections flex flex-col gap-6 pt-[90px]">
          <h2 className="text-[#181818] leading-[1.2] font-bold text-[20px]">Join Free Contest</h2>
          <p className="text-black leading-[1.2] text-[14px]">
            Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.
          </p>
          <img
            src="https://super-5-wheat.vercel.app/img/how-to-play/select-match.png"
            alt=""
            className="w-[223px] mx-auto"
          />
        </div>

        <div id="enjoy-match" className="sections flex flex-col gap-6 pt-[90px]">
          <h2 className="text-[#181818] leading-[1.2] font-bold text-[20px]">Enjoy Match</h2>
          <p className="text-black leading-[1.2] text-[14px]">
            Dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard.
          </p>
          <img
            src="https://super-5-wheat.vercel.app/img/how-to-play/select-match.png"
            alt=""
            className="w-[223px] mx-auto"
          />
        </div>

        <div className="text-black text-[14px] mt-3 font-medium">
          <b>NOTE:-</b> If you still need more help, please go to help and support to read FAQ and to contact support.
        </div>
      </div>
    </div>
  );
}

export default HowToPlay;
