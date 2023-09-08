import { oneDayType } from './Calendar'
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CategoryIcon from '@mui/icons-material/Category';

interface EventDetailPropsType{
  selectedDate:oneDayType | null
  handleModal:()=>void
}

const day_of_week:string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
const month_of_year:string[] = ["January","February","March","April","May","June","July",
                                "August","September","October","November","December"];

export default function EventDetail({selectedDate, handleModal}:EventDetailPropsType) {
  const day:number = selectedDate ? new Date(parseInt(selectedDate.year), parseInt(selectedDate.month) - 1, parseInt(selectedDate.date)).getDay()
                           : 0


  return (
    <div className='detail'>
      {selectedDate && <button className='plus-button' onClick={handleModal}>+</button> }
    {selectedDate && 
      <>
       <div className='detail-top'>
          <p>{month_of_year[parseInt(selectedDate.month) - 1]} , {selectedDate.year}</p>
          <p className='detail-date'>{selectedDate.date}</p>
          {day_of_week[day]}
       </div>
    {selectedDate.title && 
       <div className='detail-contents'>
        <span className='detail-item'>
          <WorkOutlineIcon/>
          {selectedDate.title}
        </span>
        <span className='detail-item'>
          <CategoryIcon/>
          {selectedDate.category}
        </span>
        <p className='detail-desc'>
          {selectedDate.memo}
        </p>
       </div>
    }
      </>
    }
    </div>
  )
  }
