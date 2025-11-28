import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import formatDate from "../utils/formatDate";
import Spinner from "../components/spinner";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const ContestsPage = () => {
  const [contests, setContests] = useState([]);
  const [activeTab, setActiveTab] = useState("ongoing");
  const [viewMode, setViewMode] = useState("list"); // "list" or "calendar"
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarContests, setCalendarContests] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await fetch("https://codeforces.com/api/contest.list");
        const data = await response.json();
        if (data.status === "OK") {
          const sortedContests = [...data.result].sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
          setContests(sortedContests);
          
          // Organize contests by date for calendar
          const contestsByDate = {};
          sortedContests.forEach((contest) => {
            const contestDate = new Date(contest.startTimeSeconds * 1000);
            const dateKey = contestDate.toDateString();
            if (!contestsByDate[dateKey]) {
              contestsByDate[dateKey] = [];
            }
            contestsByDate[dateKey].push(contest);
          });
          setCalendarContests(contestsByDate);
        }
      } catch (error) {
        console.error("Error fetching contests:", error);
      }
      finally{
        setLoading(false)
      }
    };

    fetchContests();
  }, []);

  const filterContests = (type) => {
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);
    const tomorrowEnd = new Date(todayEnd);
    tomorrowEnd.setDate(tomorrowEnd.getDate() + 1);

    switch (type) {
      case "ongoing":
        return contests.filter(contest => new Date(contest.startTimeSeconds * 1000) <= now && contest.phase === 'CODING');
      case "today":
        return contests.filter(contest => new Date(contest.startTimeSeconds * 1000) >= todayStart && new Date(contest.startTimeSeconds * 1000) < todayEnd);
      case "tomorrow":
        return contests.filter(contest => new Date(contest.startTimeSeconds * 1000) >= todayEnd && new Date(contest.startTimeSeconds * 1000) < tomorrowEnd);
      case "later":
        return contests.filter(contest => new Date(contest.startTimeSeconds * 1000) >= tomorrowEnd);
      default:
        return contests;
    }
  };

  const getContestsForDate = (date) => {
    const dateKey = date.toDateString();
    return calendarContests[dateKey] || [];
  };

  const tileContent = ({ date, view }) => {
    if (view === "month") {
      const dateContests = getContestsForDate(date);
      if (dateContests.length > 0) {
        return (
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
          </div>
        );
      }
    }
    return null;
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  if(loading){
    return <Spinner/>
  }

  return (
    <>
      <div className="w-full flex justify-center bg-background shadow-xl">
        <Header />
      </div>
      {contests.length===0 && <div>Error fetching contests . Please Try again Later </div> }
      <div className="container mx-auto p-4 min-h-screen bg-background text-primary_text">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Contest Calendar</h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("list")}
              className={`btn ${viewMode === "list" ? "btn-primary" : "btn-ghost"}`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`btn ${viewMode === "calendar" ? "btn-primary" : "btn-ghost"}`}
            >
              Calendar View
            </button>
          </div>
        </div>

        {viewMode === "calendar" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-background p-4 rounded-lg shadow-lg border border-secondary/80">
                <Calendar
                  onChange={handleDateChange}
                  value={selectedDate}
                  tileContent={tileContent}
                  className="w-full bg-background text-primary_text border-secondary/80"
                />
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-background p-4 rounded-lg shadow-lg border border-secondary/80">
                <h2 className="text-xl font-bold mb-4">
                  Contests on {selectedDate.toLocaleDateString()}
                </h2>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {getContestsForDate(selectedDate).length === 0 ? (
                    <p className="text-secondary_text">No contests on this date</p>
                  ) : (
                    getContestsForDate(selectedDate).map((contest) => (
                      <div
                        key={contest.id}
                        className="p-3 border border-secondary rounded-lg hover:bg-primary/10 transition-colors"
                      >
                        <a
                          href={`https://codeforces.com/contest/${contest.id}`}
                          className="text-primary hover:underline font-semibold block"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {contest.name}
                        </a>
                        <p className="text-sm text-secondary_text mt-1">
                          {formatDate(new Date(contest.startTimeSeconds * 1000))}
                        </p>
                        <p className="text-sm text-secondary_text">
                          Duration: {contest.durationSeconds / 3600} hours
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
        <div role="tablist" className="tabs tabs-lifted">
          <input
            type="radio"
            name="contest_tabs"
            role="tab"
            className="tab hover:bg-border border-secondary hover:text-primary"
            aria-label="Ongoing"
            onClick={() => setActiveTab("ongoing")}
            defaultChecked={activeTab === "ongoing"}
          />
          <div className="tab-content bg-background border-primary_text/50 rounded-box p-6">
            {filterContests(activeTab).map((contest) => (
              <div key={contest.id} className="mb-4 p-4 border border-secondary rounded-lg shadow-lg">
                <a
                  href={`https://codeforces.com/contest/${contest.id}`}
                  className="text-primary hover:underline text-lg sm:text-xl font-semibold hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contest.name}
                </a>
                <p>Start Time: {formatDate(new Date(contest.startTimeSeconds * 1000))}</p>
                <p>Duration: {contest.durationSeconds / 3600} hours</p>
              </div>
            ))}
            {filterContests(activeTab).length === 0 && <div>No Ongoing Contests</div> }
          </div>

          <input
            type="radio"
            name="contest_tabs"
            role="tab"
            className="tab hover:bg-border border-secondary hover:text-primary"
            aria-label="Today"
            onClick={() => setActiveTab("today")}
            defaultChecked={activeTab === "today"}
          />
          <div className="tab-content bg-background border-primary_text/50 rounded-box p-6">
            {filterContests(activeTab).map((contest) => (
              <div key={contest.id} className="mb-4 p-4 border border-secondary rounded-lg shadow-lg">
                <a
                  href={`https://codeforces.com/contest/${contest.id}`}
                  className="text-primary hover:underline text-lg sm:text-xl font-semibold hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contest.name}
                </a>
                <p>Start Time: {formatDate(new Date(contest.startTimeSeconds * 1000))}</p>
                <p>Duration: {contest.durationSeconds / 3600} hours</p>
              </div>
            ))}
            {filterContests(activeTab).length === 0 && <div>No contests Today</div> }
            </div>

          <input
            type="radio"
            name="contest_tabs"
            role="tab"
            className="tab hover:bg-border border-secondary hover:text-primary"
            aria-label="Tomorrow"
            onClick={() => setActiveTab("tomorrow")}
            defaultChecked={activeTab === "tomorrow"}
          />
          <div className="tab-content bg-background border-primary_text/50 rounded-box p-6">
            {filterContests(activeTab).map((contest) => (
              <div key={contest.id} className="mb-4 p-4 border border-secondary rounded-lg shadow-lg">
                <a
                  href={`https://codeforces.com/contest/${contest.id}`}
                  className="text-primary hover:underline text-lg sm:text-xl font-semibold hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contest.name}
                </a>
                <p>Start Time: {formatDate(new Date(contest.startTimeSeconds * 1000))}</p>
                <p>Duration: {contest.durationSeconds / 3600} hours</p>
              </div>
            ))}
            {filterContests(activeTab).length === 0 && <div>No contests Tommorow</div> }
          </div>

          <input
            type="radio"
            name="contest_tabs"
            role="tab"
            className="tab hover:bg-border border-secondary hover:text-primary"
            aria-label="Later"
            onClick={() => setActiveTab("later")}
            defaultChecked={activeTab === "later"}
          />
          <div className="tab-content bg-background border-primary_text/50 rounded-box p-6">
            {filterContests(activeTab).map((contest) => (
              <div key={contest.id} className="mb-4 p-4 border border-secondary rounded-lg shadow-lg">
                <a
                  href={`https://codeforces.com/contest/${contest.id}`}
                  className="text-primary hover:underline text-lg sm:text-xl font-semibold hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {contest.name}
                </a>
                <p>Start Time: {formatDate(new Date(contest.startTimeSeconds * 1000))}</p>
                <p>Duration: {contest.durationSeconds / 3600} hours</p>
              </div>
            ))}
            {filterContests(activeTab).length === 0 && <div>No contests later</div> }
          </div>
        </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ContestsPage;
