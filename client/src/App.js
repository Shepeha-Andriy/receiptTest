import './App.scss';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductList from './components/ProductList';
import Receipt from './components/Receipt';
//test
function App() {
  return (
    <div className="App">
     <ProductList></ProductList>
     <Receipt></Receipt>

     <ToastContainer></ToastContainer>
    </div>
  );
}

export default App;
