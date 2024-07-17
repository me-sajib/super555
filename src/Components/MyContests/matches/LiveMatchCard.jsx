'use client'
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { convertMillisecondsToDate } from "../../../Utils/time";

const LiveMatchesCard = () => {

  const [apiCalled, setApiCalled] = useState(false)
  const uid = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
  const route = useRouter()

  const [liveContests, setLiveContests] = useState([])
  const BASE_URL = "https://api.dream5.live";


  const openLiveContestPage = (contestId) => {
    route.push(`/live-contest/${contestId}`)
  }

  const getContestsList = () => {
    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    }

    fetch(`${BASE_URL}/api/user/contests/${uid}`, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data.status === 200) {
          const contests = data.data
          setLiveContests(contests.liveContests)
          setApiCalled(true)
        } else {
        }
      })
      .catch((error) => { })
  }

  useEffect(() => {
    if (!apiCalled) {
      getContestsList()
    }
  })

  return (
    <div className="w-full mx-auto bg-white rounded-xl overflow-hidden max-w-2xl mt-4">
      {/* <div className="md:flex">
        <div className="p-3">
          <div className="flex items-center justify-between py-2 ">
            <div className="uppercase text-sm text-[#000000] font-semibold">
              T20 World Cup
            </div>
            <div className="">
              <span className="text-[#000000] font-semibold">12-Feb-24  08:30pm </span>
             
            </div>
          </div>
          <div>
          <img
                  className="mr-2 h-2"
                  src="/img/demo/border.svg"
                  alt="New Zealand"
                />
          </div>
          <div className="flex items-center justify-between py-4">
            <div>
              <div className="flex items-center mb-4">
                <img
                  className="h-10 w-10 mr-2"
                  src="/img/demo/afg.svg"
                  alt="Afghanistan"
                />
                <span className="text-lg font-medium">Afghanistan</span>
              </div>

              <div className="flex items-center">
                <img
                  className="h-10 w-10 mr-2"
                  src="/img/demo/aus.svg"
                  alt="New Zealand"
                />
                <span className="text-lg font-medium">New Zealand</span>
              </div>
            </div>
            <div className="text-center">
              <div className="text-[#ED5311] font-bold">Live</div>
            </div>
          </div>
        </div>
      </div> */}

      <div className='all__tickets__container'>
        {liveContests.length > 0 &&
          liveContests.map((ticket) => {
            return (
              <>
                <div className='tickets__card__container cursor-pointer' onClick={() => openLiveContestPage(ticket._id)} key={ticket._id}>
                  <article className='each__ticket__container'>
                    <div className='flex justify-between'>
                      <div className='team-image flex justify-center items-center' style={{ flex: '20%' }}>
                        <img src={ticket.teamOneLogo || 'https://i.postimg.cc/jjv3B5vP/flag1.jpg'} className='h-16 rounded-2xl' alt='Left Team' />
                      </div>
                      <div style={{ flex: '60%' }} className='text-center'>
                        <div>
                          <h2 className='text-xs mb-1'> {ticket.description}</h2>
                          <hr />
                        </div>
                        <div className='flex flex-col items-center my-4'>
                          <h2 className='font-bold'>
                            {ticket.teamOneShortName.length > 0 ? ticket.teamOneShortName : ticket.teamOne} vs {ticket.teamTwoShortName.length > 0 ? ticket.teamTwoShortName : ticket.teamTwo}
                          </h2>
                          <div class='text-xs text-gray-500'>The contest is live</div>
                          <div className='text-xs font-bold text-gray-500'>{ticket.entryFees} SuperCoins</div>
                          {<div className='text-xs'>{convertMillisecondsToDate(ticket.startDate)}</div>}
                        </div>
                      </div>
                      <div className='team-image flex justify-center items-center' style={{ flex: '20%' }}>
                        <img className='h-16 rounded-2xl' src={ticket.teamTwoLogo || 'https://i.postimg.cc/1tt7SQYT/flag2.jpg'} alt='Right Team' />
                      </div>
                    </div>
                  </article>
                </div>
              </>
            )
          })}

      </div>
      {liveContests.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="text-green-600 h-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>

          <p className='text-2xl text-gray-500 mt-2'>No Contests found</p>
        </div>
      )}
    </div>
  );
};
export default LiveMatchesCard;
