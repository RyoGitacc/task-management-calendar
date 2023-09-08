import {z} from 'zod';
import CATEGORIES from '../category';
import {useForm} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task } from '../Task';
import { oneDayType } from './Calendar';
import CloseIcon from '@mui/icons-material/Close';



function isValidCategory(category:string):boolean{
    if(CATEGORIES.find(c=>c === category) !== undefined) return true;
    else return false;
}

const TaskFormSchema = z.object({
    title:z.string().min(
        3,{ message : 'tilte must be more than 3 charactors'})
        .max(50, {message :'tilte must be less than 50 charactors'}),
    category:z.string().refine(isValidCategory, {message:'Invalid category'}),
    memo:z.string()
})

export type TaskFormDataType = z.infer<typeof TaskFormSchema>

type TaskFormPropsType={
   handleAddTask:(task:Omit<Task,"id">)=>void
   selectedDate:oneDayType | null
   handleModal:()=>void
}


export default function TaskForm({handleAddTask,selectedDate,handleModal}:TaskFormPropsType) {
  const {register,handleSubmit,reset,formState:{errors}}=useForm<TaskFormDataType>(
    {resolver:zodResolver(TaskFormSchema)}
  )
  
  const submitForm=(data:TaskFormDataType):void=>{
    handleAddTask(data)
    reset();
    handleModal()
  }

  const closeModal=():void=>{
    reset();
    handleModal();
  }


  return (
   <form className='form' onSubmit={handleSubmit(submitForm)}>
    {selectedDate && 
     <h3 className='form-header'>{selectedDate.year}-{selectedDate.month}-{selectedDate.date}</h3>
    }
     <div>
      <label htmlFor="title" className="form-label">Title</label>
      <input type="text" className="form-control" id="title" placeholder="title" {...register('title')}/>
      {errors.title && errors.title.message}
     </div>
     <div>
     <label  className="form-label">Category</label>
     <select className="form-select" aria-label="Default select example"  {...register('category')} >
      <option value="">Open this select menu</option>
        {CATEGORIES.map(c=>(
           <option key={c} value={c}>{c}</option>
         ))}
      </select>
     {errors.category?.message}
     </div>
     <div>
      <label htmlFor="memo" className="form-label">Memo</label>
      <textarea className="form-control" id="memo"  {...register('memo')}/>
      {errors.memo && errors.memo.message}
     </div>
     <div className='submit-btn-container'>
      <button type='submit' className='btn btn-primary'>Submit</button>
     </div>
     <button className="modal-close-button" onClick={closeModal}>
      <CloseIcon/>
     </button>
   </form>
  )

}
