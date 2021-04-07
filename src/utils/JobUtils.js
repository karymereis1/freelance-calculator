module.exports = {
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