import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './components/Pages/Home.jsx'
import S_opd_all from './components/Pages/opd_all.jsx'
import Health_services from './components/Menus/HealthServices.jsx'
import Service_plan from './components/Menus/ServicePlan.jsx'
import RDU from './components/Pages/RDU/rdu.jsx'
import S_rdu6 from './components/Pages/RDU/s_rdu6.jsx'
import S_rdu7 from './components/Pages/RDU/s_rdu7.jsx'
import S_rdu8 from './components/Pages/RDU/s_rdu8.jsx'
import S_rdu9 from './components/Pages/RDU/s_rdu9.jsx'
import S_rdu10 from './components/Pages/RDU/s_rdu10.jsx'
import S_rdu12 from './components/Pages/RDU/s_rdu12.jsx'
import S_rdu13 from './components/Pages/RDU/s_rdu13.jsx'
import S_rdu14 from './components/Pages/RDU/s_rdu14.jsx'
import S_rdu15 from './components/Pages/RDU/s_rdu15.jsx'
import S_rdu22 from './components/Pages/RDU/s_rdu22.jsx'
import S_rdu16 from './components/Pages/RDU/s_rdu16.jsx'
import S_rdu17 from './components/Pages/RDU/s_rdu17.jsx'
import S_rdu18 from './components/Pages/RDU/s_rdu18.jsx'
import S_rdu21 from './components/Pages/RDU/s_rdu21.jsx'
import S_rdu19 from './components/Pages/RDU/s_rdu19.jsx'
import S_rdu20 from './components/Pages/RDU/s_rdu20.jsx'
import S_rdu_pcu from './components/Pages/RDU/s_rdu_pcu.jsx'
import S_ddd1 from './components/Pages/RDU/s_ddd1.jsx'
import S_ddd2 from './components/Pages/RDU/s_ddd2.jsx'
import S_ddd3 from './components/Pages/RDU/s_ddd3.jsx'
import S_ddd4 from './components/Pages/RDU/s_ddd4.jsx'
import S_ddd5 from './components/Pages/RDU/s_ddd5.jsx'
import S_ddd6 from './components/Pages/RDU/s_ddd6.jsx'



function App() {
  
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route path="/" element={<Home />} />
          <Route path="/opd_all" element={<S_opd_all />} />
          <Route path="/health_services" element={<Health_services />} />
          <Route path="/service_plan" element={<Service_plan />} />
          <Route path="/rdu_service_plan" element={<RDU />} />
          <Route path="/rdu/s_rdu6" element={<S_rdu6 />} />
          <Route path="/rdu/s_rdu7" element={<S_rdu7 />} />
          <Route path="/rdu/s_rdu8" element={<S_rdu8 />} />
          <Route path="/rdu/s_rdu9" element={<S_rdu9 />} />
          <Route path="/rdu/s_rdu10" element={<S_rdu10 />} />
          <Route path="/rdu/s_rdu12" element={<S_rdu12 />} />
          <Route path="/rdu/s_rdu13" element={<S_rdu13 />} />
          <Route path="/rdu/s_rdu14" element={<S_rdu14 />} />
          <Route path="/rdu/s_rdu15" element={<S_rdu15 />} />
          <Route path="/rdu/s_rdu22" element={<S_rdu22 />} />
          <Route path="/rdu/s_rdu16" element={<S_rdu16 />} />
          <Route path="/rdu/s_rdu17" element={<S_rdu17 />} />
          <Route path="/rdu/s_rdu18" element={<S_rdu18 />} />
          <Route path="/rdu/s_rdu21" element={<S_rdu21 />} />
          <Route path="/rdu/s_rdu19" element={<S_rdu19 />} />
          <Route path="/rdu/s_rdu20" element={<S_rdu20 />} />
          <Route path="/rdu/s_rdu_pcu" element={<S_rdu_pcu />} />
          <Route path="/rdu/s_ddd1" element={<S_ddd1 />} />
          <Route path="/rdu/s_ddd2" element={<S_ddd2 />} />
          <Route path="/rdu/s_ddd3" element={<S_ddd3 />} />
          <Route path="/rdu/s_ddd4" element={<S_ddd4 />} />
          <Route path="/rdu/s_ddd5" element={<S_ddd5 />} />
          <Route path="/rdu/s_ddd6" element={<S_ddd6 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
