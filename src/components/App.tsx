
import '../App.css'
import Calendar from './Calendar';
import { BrowserRouter,Routes ,Route} from 'react-router-dom';

export default function App() {
    


  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Calendar/>} />
        <Route path='/:year/:month' element={<Calendar/>} />
      </Routes>
    </BrowserRouter>
  )
}
