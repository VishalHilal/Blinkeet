import { Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import fetchUserDetails from './utils/fetchUserDetails';
import { setUserDetails } from './store/userSlice';
import { setAllCategory, setAllSubCategory, setLoadingCategory } from './store/productSlice';
import { useDispatch } from 'react-redux';
import Axios from './utils/Axios';
import SummaryApi from './common/SummaryApi';
import GlobalProvider from './provider/GlobalProvider';
import CartMobileLink from './components/CartMobile';
import DisplayCartItem from './components/DisplayCartItem';

// Routes where the footer should NOT appear
const NO_FOOTER_PREFIXES = [
  '/dashboard',
  '/checkout',
  '/cart',
  '/success',
  '/cancel',
  '/user',
];

// Header heights: 64px mobile / 68px desktop
const HEADER_H = 'pt-16 lg:pt-[68px]';

function App() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [openCartSection, setOpenCartSection] = useState(false);

  const showFooter = !NO_FOOTER_PREFIXES.some((prefix) =>
    location.pathname.startsWith(prefix)
  );

  const fetchUser = async () => {
    try {
      const userData = await fetchUserDetails();
      if (userData?.data) dispatch(setUserDetails(userData.data));
    } catch {}
  };

  const fetchCategory = async () => {
    try {
      dispatch(setLoadingCategory(true));
      const res = await Axios({ ...SummaryApi.getCategory });
      if (res.data.success)
        dispatch(setAllCategory(res.data.data.sort((a, b) => a.name.localeCompare(b.name))));
    } catch {}
    finally { dispatch(setLoadingCategory(false)); }
  };

  const fetchSubCategory = async () => {
    try {
      const res = await Axios({ ...SummaryApi.getSubCategory });
      if (res.data.success)
        dispatch(setAllSubCategory(res.data.data.sort((a, b) => a.name.localeCompare(b.name))));
    } catch {}
  };

  useEffect(() => {
    fetchUser();
    fetchCategory();
    fetchSubCategory();
  }, []);

  return (
    <GlobalProvider>
      <div className="flex flex-col min-h-screen bg-gray-50 text-neutral-800">

        {/* Fixed top navbar */}
        <Header openCartSection={setOpenCartSection} />

        {/* Content area — offset by header height */}
        <main className={`flex-1 flex flex-col w-full ${HEADER_H}`}>
          <Outlet />
        </main>

        {/* Footer — hidden on dashboard and utility pages */}
        {showFooter && <Footer />}
      </div>

      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />

      {location.pathname !== '/checkout' && (
        <CartMobileLink openCartSection={() => setOpenCartSection(true)} />
      )}

      {openCartSection && (
        <DisplayCartItem close={() => setOpenCartSection(false)} />
      )}
    </GlobalProvider>
  );
}

export default App;
