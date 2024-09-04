/** Icons are imported separatly to reduce build time */
import Squares2X2Icon from '@heroicons/react/24/outline/Squares2X2Icon'
import CurrencyDollarIcon from '@heroicons/react/24/outline/CurrencyDollarIcon'
import InboxArrowDownIcon from '@heroicons/react/24/outline/InboxArrowDownIcon'

const iconClasses = `h-6 w-6`

const routes = [

  {
    path: '/app/welcome',
    icon: <Squares2X2Icon className={iconClasses}/>, 
    name: 'Dashboard',
  },
  {
    path: '/app/create-lead', // url
    icon: <InboxArrowDownIcon className={iconClasses}/>, // icon component
    name: 'Create Lead', // name that appear in Sidebar
  },
  {
    path: '/app/leads', // url
    icon: <CurrencyDollarIcon className={iconClasses}/>, // icon component
    name: 'Leads', // name that appear in Sidebar
  },
   
]

export default routes


