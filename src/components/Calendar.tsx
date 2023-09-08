import { useEffect, useState } from "react";
import TaskForm from "./TaskForm";
import { Task } from "../Task";
import EventDetail from "./EventDetail";
import { useNavigate, useParams } from "react-router-dom";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

const day_of_week:string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const month_of_year:string[] = ["January","February","March","April","May","June","July",
                                "August","September","October","November","December"];
export interface oneDayType{
    year:string,
    month:string,
    date:string,
    title:string,
    category:string,
    memo:string
}

interface calendarType{
  [key:string]:oneDayType[]
}

interface ParamsType{
  [key:string]:string | undefined
}


export default function Calendar() {
    const currentDate = new Date();
    const [days,setDays]=useState<oneDayType[]>([])
    const [selectedDate,setSelectedDate]=useState<oneDayType| null>(null);
    const [isOpenModal, setIsOpenModal]=useState<boolean>(false);
    const navigete = useNavigate();
    const params = useParams<ParamsType>() 

    const year:number= params.year !== undefined ? parseInt(params.year) : new Date().getFullYear();
    const month:number= params.month !== undefined ? parseInt(params.month): new Date().getMonth();
    
    useEffect(()=>{
      const setDaysOfMonth=():void =>{

        const jsonValue = localStorage.getItem('calendar');
        if(jsonValue){
           const propertyKey:string= year.toString() + (month + 1).toString();
           const calendar:calendarType = JSON.parse(jsonValue);
           for(const key in calendar){
            if(key === propertyKey){
              setDays(calendar[key])
              return;
            }
           }
        }
        
       
        const lastDayOfCurrentMonth:number= new Date(year, month + 1, 0).getDate();
        const dayOfFirstday = new Date(year, month, 1).getDay();
        const daysOfCurrentMonth=[]; 
        
        for(let i=0 - dayOfFirstday; i < lastDayOfCurrentMonth;i++){
           
              const oneDay:oneDayType= {
                year: year.toString(),
                month: (month + 1).toString(),
                date:  i < 0 ? "" : (i + 1).toString(),
                title:"",
                category:"",
                memo:""
              }
               
              daysOfCurrentMonth.push(oneDay);
        }
        
        setDays(daysOfCurrentMonth)
    }

    setDaysOfMonth();
    },[month, params, year])
    

    

    const createCalender=(days:oneDayType[], perRow:number):JSX.Element[]=>{
         const rows=[];

         for(let i=0;i<days.length;i+=perRow){
          const row=days.slice(i,i + perRow);
          rows.push(
            <tr key={i}>
              {row.map((d,index)=>(
                <td key={index} onClick={()=>d.date ? selectDate(d) : undefined}>      
                <div className="number-container" style={{backgroundColor: d.date === selectedDate?.date ? "#afafb0" : 'white'}}>
                  <span className="number" 
                                  style={{color: d.year === currentDate.getFullYear().toString() && d.month === (currentDate.getMonth() + 1).toString() && d.date === currentDate.getDate().toString() ? 'blue' : 'black'}}>
                    {d.date}
                  </span>
                {d.title && <span className="red-circle"></span>}
                </div>
                </td>
              ))}
            </tr>
          )
         }
        
        return rows;
    }


    const nextMonth=():void=>{
        const newDate:Date= new Date(year, month + 1, 1);
        const updatedYear = newDate.getFullYear();
        const updatedMonth= newDate.getMonth();
        navigete(`/${updatedYear}/${updatedMonth}`)
        setSelectedDate(null);
    }

    const prevMonth=():void=>{
      const newDate:Date= new Date(year, month - 1, 1);
      const updatedYear = newDate.getFullYear();
      const updatedMonth= newDate.getMonth();
      navigete(`/${updatedYear}/${updatedMonth}`)
      setSelectedDate(null);
    }

    const selectDate=(day:oneDayType):void=>{
        setSelectedDate(day);
    
    }

    const handleModal=():void=>{
       setIsOpenModal(!isOpenModal)
    }

    const handleAddTask=(taskData:Omit<Task,'id'>)=>{
      if(selectedDate){
        const targetDay= selectedDate.date;
        const updatedDays = days.map(d=>{
          if(d.date === targetDay){
            d.title = taskData.title;
            d.category = taskData.category;
            d.memo=taskData.memo;
          }
          return d;
        })
  
        setDays(updatedDays)
        
        let updatedCalendar:calendarType ={};
        const jsonValue = localStorage.getItem('calendar');
        if(jsonValue !== null){
              updatedCalendar = JSON.parse(jsonValue);
        }
      
        const key:string = selectedDate.year + selectedDate.month
        updatedCalendar[key] = updatedDays;

        localStorage.setItem('calendar',JSON.stringify(updatedCalendar))
        
      }

      
      
    }
    
  return (
  <div className="main">
    <div className="calendar">
     <div className="calendar-header">
      <h3 className="header">
        <div className="year">{year}</div>
        <span className="arrow" onClick={prevMonth}>
          <ArrowLeftIcon/>
        </span>  
        <span className="month">{month_of_year[month]}</span>
        <span className="arrow" onClick={nextMonth}>
          <ArrowRightIcon/>
        </span>
      </h3>
     </div>
      <table>
        <thead>
         <tr>
           {day_of_week.map((d,index)=>(
               <th key={index}>{d}</th>
           ))}
         </tr>
        </thead>
        <tbody>
          {createCalender(days,7)} 
        </tbody>
      </table>
      
    </div>
     <EventDetail selectedDate={selectedDate} handleModal={handleModal}/>
     <div className={isOpenModal ? "open-modal" : "close-modal"}>
       <TaskForm handleAddTask={handleAddTask} selectedDate={selectedDate} 
                 handleModal={handleModal} />
     </div>
  </div>
  )
}
