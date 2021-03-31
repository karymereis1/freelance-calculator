const express = require ('express');
const routes = express.Router()

const views = __dirname + "/views/"


//request, response
// server.get('/', (request, response) => {
//     return response.sendFile(__dirname + "/views/index.html")
// })
//com a instalação do ejs os arquivos htmal não serão mais enviados diretamente
//mas sim serão renderizados pro ejs

// const basePath = __dirname + "/views"

// routes.get('/', (request, response) => response.sendFile(basePath + "/index.html"))
// routes.get('/job', (request, response) => response.sendFile(basePath + "/job.html"))
// routes.get('/job/edit', (request, response) => response.sendFile(basePath + "/job-edit.html"))
// routes.get('/profile', (request, response) => response.sendFile(basePath + "/profile.html"))

const profile = {
    name: "Karyme",
    avatar: "https://avatars.githubusercontent.com/karymereis1",
    "monthly-budget": 3000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4
}

const jobs = [
    {
        id: 1,
        name: "testes",
        "daily-hours": 2,
        "total-hours": 2,
        created_at: Date.now()
    },
    {
        id: 1,
        name: "karyme",
        "daily-hours": 2,
        "total-hours": 2,
        created_at: Date.now()
    }

]

routes.get('/', (req, res) => {

    const updated_jobs = jobs.map((job) => {
    //ajustes no job
    //calculo tempo
        const remaining_days = (job["total-hours"] / job["daily-hours"]).toFixed()
        const created_date = new Date(job.created_at)
        const due_day = created_date.getDate() + Number(remaining_days)
        const due_date_in_ms = created_date.setDate(due_day) 
        
        const time_diff_in_ms = due_date_in_ms - Date.now()
        console.log(due_day)
        console.log(due_date)
        return job
    })


    return res.render(views + "index", { jobs })

})
routes.get('/job', (req, res) => res.render(views + "job"))
routes.post('/job', (req, res) => {
    //req.body = { name: 'TESTE', 'daily-hours': '7', 'total-hours': '7' }
    const last_job_id = jobs[jobs.length - 1]?.id || 1;
    jobs.push({
        id: last_job_id + 1,
        name: req.body.name,
        "daily-hours": req.body["daily-hours"],
        "total-hours": req.body["total-hours"],
        created_at: Date.now()
    })
    return res.redirect('/')
})
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"))
routes.get('/profile', (req, res) => res.render(views + "profile", {profile: profile}))


module.exports = routes;