const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  async index(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();
    let statusCount = {
      progress: 0,
      done: 0,
      total: jobs.length,
    };

    let jobTotalHours = 0;

    const updated_jobs = jobs.map((job) => {
      const remaining = JobUtils.remaining_days(job);
      const status = remaining <= 0 ? "done" : "progress";

      statusCount[status] += 1;
      jobTotalHours = status === "progress" ? jobTotalHours + Number(job["daily-hours"]) : jobTotalHours
    //   if (status == "progress") {
    //     jobTotalHours += Number(job["daily-hours"]);
    //   }

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.caculate_budget(job, profile["value-hour"]),
      };
    });

    const freeHours = profile["hours-per-day"] - jobTotalHours;

    return res.render("index", {
      jobs: updated_jobs,
      profile: profile,
      statusCount: statusCount,
      freeHours: freeHours,
    });
  },
};
