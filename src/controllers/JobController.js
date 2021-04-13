const Job = require("../model/Job");
const JobUtils = require("../utils/JobUtils");
const Profile = require("../model/Profile");

module.exports = {
  
  create(req, res) {
    return res.render("job");
  },

  async save(req, res) {
    //req.body = { name: 'TESTE', 'daily-hours': '7', 'total-hours': '7' }
    const jobs = await Job.get();
    const last_job_id = jobs[jobs.length - 1]?.id || 0;
    Job.create({
      id: last_job_id + 1,
      name: req.body.name,
      "daily-hours": req.body["daily-hours"],
      "total-hours": req.body["total-hours"],
      created_at: Date.now(),
    });
    return res.redirect("/");
  },

  async show(req, res) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    const job_id = req.params.id;

    const job = jobs.find((job) => Number(job.id) === Number(job_id));

    if (!job) {
      return res.send("Job not found");
    }

    job.budget = JobUtils.caculate_budget(job, profile["value-hour"]);

    return res.render("job-edit", { job });
  },

  async update(req, res) {
    const jobs = await Job.get();
    const job_id = req.params.id;
    const job = jobs.find((job) => Number(job.id) === Number(job_id));

    if (!job) {
      return res.send("Job not found");
    }

    const updated_job = {
      ...job,
      name: req.body.name,
      "total-hours": req.body["total-hours"],
      "daily-hours": req.body["daily-hours"],
    };

    const newJobs = jobs.map((job) => {
      if (Number(job.id) === Number(job_id)) {
        job = updated_job;
      }
      return job;
    });

    Job.update(newJobs);

    res.redirect("/");
  },
  
  delete(req, res) {
    const job_id = req.params.id;

    Job.delete(job_id);

    return res.redirect("/");
  },
};
