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

const Profile = {
    data: {
        name: "Karyme",
        avatar: "https://avatars.githubusercontent.com/karymereis1",
        "monthly-budget": 3000,
        "days-per-week": 5,
        "hours-per-day": 5,
        "vacation-per-year": 4,
        "value-hour": 75
    },

    controllers: {
        index (req, res) {
           return res.render(views + "profile", {profile: Profile.data})
        },

        update (req, res) {

            const data = req.body
            const weeks_per_year = 52
            const weeks_per_month = (weeks_per_year - data["vacation-per-year"]) / 12
            const week_total_hours = data["hours-per-day"] * data["days-per-week"]
            const monthly_total_hours = week_total_hours * weeks_per_month

            const value_hour = data["monthly-budget"] / monthly_total_hours

            Profile.data = {
                ...Profile.data,
                ...req.body,
                "value-hour": value_hour
            }

            return res.redirect('/profile')
        }
    }
}

const Job = {
    data: [
        {
            id: 1,
            name: "testes",
            "daily-hours": 2,
            "total-hours": 60,
            created_at: Date.now(),
        },
        {
            id: 2,
            name: "karyme",
            "daily-hours": 2,
            "total-hours": 2,
            created_at: Date.now(),
        }

    ],

    controllers: {
        index(req, res) {            

            const updated_jobs = Job.data.map((job) => {             
                const remaining = Job.services.remaining_days(job)
                const status = remaining <= 0 ? 'done' : 'progress'
        
                return {
                    ...job,
                    remaining,
                    status,
                    budget: Job.services.caculate_budget(job, Profile.data["value-hour"])
                }
            })            
        
            return res.render(views + "index", { jobs: updated_jobs })
                        
        },

        create(req, res) {
            return res.render (views + "job")             
        },

        save(req, res) {
            //req.body = { name: 'TESTE', 'daily-hours': '7', 'total-hours': '7' }
            const last_job_id = Job.data[Job.data.length - 1]?.id || 1;
            Job.data.push({
                id: last_job_id + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            })
            return res.redirect('/')
        },

        show(req, res) {
            const job_id = req.params.id

            const job = Job.data.find(job => Number(job.id) === Number(job_id))

            if(!job){
                return res.send('Job not found')
            }

            job.budget = Job.services.caculate_budget(job, Profile.data["value-hour"])

            return res.render(views + "job-edit", { job })
        }
    },

    services: {
        remaining_days(job) {
    
            const remaining_days = (job["total-hours"] / job["daily-hours"]).toFixed()
            const created_date = new Date(job.created_at)
            const due_day = created_date.getDate() + Number(remaining_days)
            const due_date_in_ms = created_date.setDate(due_day) 
            
            const time_diff_in_ms = due_date_in_ms - Date.now() //milissegundos
            const day_in_ms = 1000 * 60 * 60 * 24
        
            const day_diff = Math.floor(time_diff_in_ms/day_in_ms)
        
            return day_diff //restam x dias
        
        },

        caculate_budget: (job, value_hour) => value_hour * job["total-hours"]
    }
}

routes.get('/', Job.controllers.index)
routes.get('/job', Job.controllers.create)
routes.post('/job', Job.controllers.save)
routes.get('/job/:id', Job.controllers.show)
routes.get('/profile', Profile.controllers.index)
routes.post('/profile', Profile.controllers.update)


module.exports = routes;