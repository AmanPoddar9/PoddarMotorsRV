'use client'
import { Fragment, useState, useEffect } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from '@heroicons/react/20/solid'
import axios from 'axios'
import { Button, Slider } from 'antd'
import { AmountWithCommas, toTitleCase } from '../utils'
import FeaturedCard from '../components/FeaturedCard'
import { FaSearch } from 'react-icons/fa'
import API_URL from '../config/api'
import { trackSearch, trackFilterUse } from '../utils/analytics'

import { Oval } from 'react-loader-spinner'

const sortOptions = [
  { name: 'Price: Low to High', href: '#', current: false, param: 'price_asc' },
  {
    name: 'Price: High to Low',
    href: '#',
    current: false,
    param: 'price_desc',
  },
  {
    name: 'KM Driven: Low to High',
    href: '#',
    current: false,
    param: 'kmDriven_asc',
  },
  {
    name: 'KM Driven: High to Low',
    href: '#',
    current: false,
    param: 'kmDriven_desc',
  },
  { name: 'Year: Low to High', href: '#', current: false, param: 'year_asc' },
  { name: 'Year: High to Low', href: '#', current: false, param: 'year_desc' },
]
let url = API_URL.endsWith('/') ? API_URL : API_URL + '/'
// url = 'http://localhost:5000/'

const carTypes = ['Hatchback', 'Sedan', 'SUV', 'MUV', 'Luxury']

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '../contexts/LanguageContext'

export default function Buy({ allListings }) {
  const { t } = useLanguage()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [brands, setBrands] = useState([])
  const [types, setTypes] = useState([])
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])

  const [seatsCount, setSeatsCount] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  // Initialize filters from URL or defaults
  const [filters, setFilters] = useState([
    {
      id: 'brand',
      name: t('buy.filters.brand'),
      options: [],
    },
    {
      id: 'type',
      name: t('buy.filters.body'),
      options: [],
    },
    {
      id: 'budget',
      name: t('buy.filters.price'),
      options: [
        { value: '0-400000', label: 'Under 4 Lakhs', checked: false },
        { value: '400000-800000', label: '4-8 Lakhs', checked: false },
        { value: '800000-1200000', label: '8-12 Lakhs', checked: false },
        { value: '1200000', label: 'Above 12 Lakhs', checked: false },
      ],
    },
    {
      id: 'modelYear',
      name: t('buy.filters.year'),
      type: 'slider',
      config: {
        min: 2000,
        max: new Date().getFullYear(),
        step: 1,
        value: [2000, new Date().getFullYear()],
      },
    },
    {
      id: 'fuelType',
      name: t('buy.filters.fuel'),
      options: [],
    },
    {
      id: 'transmissionType',
      name: t('buy.filters.transmission'),
      options: [],
    },
    {
      id: 'ownership',
      name: t('buy.card.owner'),
      options: [
        { value: 1, label: '1', checked: false },
        { value: 2, label: '2', checked: false },
        { value: 3, label: '3', checked: false },
        { value: 4, label: '4', checked: false },
      ],
    },
    {
      id: 'kmDriven',
      name: t('buy.filters.km'),
      options: [
        { value: '0-10000', label: 'Under 10 Thousand', checked: false },
        { value: '10000-20000', label: '10-20 Thousand', checked: false },
        { value: '20000-50000', label: '20-50 Thousand', checked: false },
        { value: '50000', label: 'Above 50 Thousand', checked: false },
      ],
    },
    {
      id: 'seats',
      name: 'Seats',
      options: [],
    },
  ])

  // Update filter names when language changes
  useEffect(() => {
    setFilters(prev => prev.map(f => {
      switch(f.id) {
        case 'brand': return { ...f, name: t('buy.filters.brand') }
        case 'type': return { ...f, name: t('buy.filters.body') }
        case 'budget': return { ...f, name: t('buy.filters.price') }
        case 'modelYear': return { ...f, name: t('buy.filters.year') }
        case 'fuelType': return { ...f, name: t('buy.filters.fuel') }
        case 'transmissionType': return { ...f, name: t('buy.filters.transmission') }
        case 'ownership': return { ...f, name: t('buy.card.owner') }
        case 'kmDriven': return { ...f, name: t('buy.filters.km') }
        default: return f
      }
    }))
  }, [t])

  const sortListings = (key, order) => {
    const tempListings = [...listings]
    tempListings.sort((a, b) => {
      if (order === 'asc') {
        return a[key] - b[key]
      } else if (order === 'desc') {
        return b[key] - a[key]
      }
      return 0
    })
    setListings(tempListings)
  }

  const handleSort = (value) => {
    if (value.length) {
      let params = value.split('_')
      sortListings(params[0], params[1])
    }
  }

  const clearFilters = () => {
    router.push('/buy')
    setSearchQuery('')
    // Reset filters state manually if needed, or let useEffect handle it on route change
    // For immediate feedback, we might want to reset locally too, but route change will trigger re-fetch
  }

  const updateFilters = async (inputFilters, clear) => {
    setMobileFiltersOpen(false)
    setLoading(true)
    
    // Construct query params from current state (or inputFilters if provided)
    const params = new URLSearchParams()
    
    // If clearing, just push empty
    if (clear) {
      router.push('/buy')
      return
    }

    // Helper to add params
    const addParam = (key, value) => {
      if (Array.isArray(value)) {
        value.forEach(v => params.append(key, v))
      } else {
        params.append(key, value)
      }
    }

    filters.forEach((filter) => {
      const key = filter.id
      if (filter.type === 'slider') {
         // Only add if different from default to keep URL clean? Or always add?
         // Let's always add for consistency if it's not default range
         const val = filter.config.value
         if (val[0] !== filter.config.min || val[1] !== filter.config.max) {
             addParam(key, val.join('-')) // Send as range string "min-max"
         }
      } else {
        filter.options.forEach((opt) => {
          if (opt.checked) {
            addParam(key, opt.value)
          }
        })
      }
    })

    if (searchQuery) {
      params.set('search', searchQuery)
    }

    // Update URL
    router.push(`/buy?${params.toString()}`)
    
    // Fetch data based on these params
    // We can reuse the logic to fetch filtered data
    // Ideally, we should parse the params back into an object for the API call
    // But since we have the state here, we can construct the object directly
    
    let obj = {}
    filters.forEach((filter) => {
        const key = filter.id
        let tempArr = []
        if (filter.type === 'slider') {
          tempArr = filter.config.value
        } else {
          filter.options.forEach((opt) => {
            if (opt.checked) {
              tempArr.push(opt.value)
            }
          })
        }
        if (tempArr.length) {
            // For slider, we might want to send it differently if API expects it
            // The original code sent `tempArr` which was `[min, max]` for slider
            obj[key] = tempArr
        }
    })
    
    if (searchQuery.length > 0) {
      obj['search'] = searchQuery
    }

    try {
      const response = await axios.post(url + 'api/listings/filtered', obj)
      setListings(response.data)
      
      // Analytics: Track search
      if (searchQuery) {
        trackSearch(searchQuery)
      }
      
      // Analytics: Track filter usage
      filters.forEach((filter) => {
        if (filter.type === 'slider') {
          const val = filter.config.value
          if (val[0] !== filter.config.min || val[1] !== filter.config.max) {
            trackFilterUse(filter.name, `${val[0]}-${val[1]}`)
          }
        } else {
          filter.options.forEach((opt) => {
            if (opt.checked) {
              trackFilterUse(filter.name, opt.label)
            }
          })
        }
      })
      
      // Facebook Pixel: Search event
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Search', {
          search_string: searchQuery || 'filtered',
          content_category: 'Cars',
        })
      }
    } catch (e) {
      console.log(e.message)
    }
    setLoading(false)
  }

  const fetchAllListings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(url + 'api/listings')
      if (response.data) {
        setListings(response.data)
      }
      setLoading(false)
    } catch (e) {
      console.log(e.message)
      setLoading(false)
    }
  }

  const fetchAllBrands = async () => {
    try {
      const response = await axios.get(url + 'api/listings/brands')
      if (response.data) {
        response.data.sort()
        const tempObj = [...filters]
        
        // Get checked brands from URL
        const brandParams = searchParams.getAll('brand')
        
        const index = tempObj.findIndex((item) => item.id == 'brand')
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: brandParams.includes(item),
          }
        })
        setFilters(tempObj)
        setBrands(response.data)
      }
    } catch (e) {
      console.log(e.message)
    }
  }
  
  // ... (sliderFormatter, handleSliderChange, handleCheckboxChange remain similar but should not rely on localStorage)
  const sliderFormatter = (value) => {
    if (value) return AmountWithCommas(value)
  }
  const handleSliderChange = (id, value) => {
    const tempFilters = [...filters]
    const index = tempFilters.findIndex((item) => item.id == id)
    tempFilters[index]['config']['value'] = value
    setFilters(tempFilters)
  }
  const handleCheckboxChange = (id, label, checked) => {
    const tempFilters = [...filters]
    const index = tempFilters.findIndex((item) => item.id == id)
    const options = tempFilters[index]['options']
    const optionsIndex = options.findIndex((item) => item.label == label)
    options[optionsIndex]['checked'] = checked
    tempFilters[index]['options'] = options
    setFilters(tempFilters)
  }

  // Helper to sync state from URL on mount/update
  useEffect(() => {
      // This effect runs when searchParams change (e.g. navigation)
      // We need to update the filter state (checkboxes etc) to match the URL
      // AND fetch the filtered data
      
      const currentParams = new URLSearchParams(searchParams.toString())
      
      // If no params, fetch all
      if ([...currentParams.keys()].length === 0) {
          if (allListings && listings.length === 0) {
             // Initial load with no params
             setListings(allListings)
          } else {
             // Navigation to /buy with no params
             fetchAllListings()
          }
          // Reset filters visual state
          // We need to ensure fetchAllBrands etc are called to populate options first
          // But those are async.
          return
      }

      // Construct filter object for API
      let apiObj = {}
      
      // Update local filter state to match URL
      // This is tricky because options (brands, types) might not be loaded yet
      // We'll handle the "checked" status in the fetchAll* functions or a separate sync function
      
      // For API call:
      for (const [key, value] of currentParams.entries()) {
          if (key === 'search') {
              apiObj['search'] = value
              setSearchQuery(value)
              continue
          }
          // Handle array params
          if (!apiObj[key]) apiObj[key] = []
          
          if (key === 'modelYear') {
              // Expecting "min-max" string in URL
              const [min, max] = value.split('-').map(Number)
              apiObj[key] = [min, max]
          } else {
              apiObj[key].push(value)
          }
      }
      
      // Call API
      const fetchFiltered = async () => {
          setLoading(true)
          try {
              const response = await axios.post(url + 'api/listings/filtered', apiObj)
              setListings(response.data)
          } catch (e) {
              console.log(e)
          }
          setLoading(false)
      }
      fetchFiltered()

  }, [searchParams]) // Re-run when URL changes

  // Initial data fetch for options
  useEffect(() => {
    fetchAllBrands()
    fetchAllTypes()
    fetchAllSeats()
    fetchAllFuelTypes()
    fetchAllTransmissionTypes()
    // updateCheckedPrices() // Replaced by URL logic
  }, [searchParams]) // Re-run to update "checked" state based on URL

  // ... (Rest of the fetch functions need to be updated to check searchParams instead of localStorage)
  
  const fetchAllTypes = async () => {
    try {
      const response = await axios.get(url + 'api/listings/types')
      if (response.data) {
        const tempObj = [...filters]
        const index = tempObj.findIndex((item) => item.id == 'type')
        
        const typeParams = searchParams.getAll('type')
        
        response.data.sort((a, b) => {
          return carTypes.indexOf(a) - carTypes.indexOf(b)
        })
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: typeParams.includes(item),
          }
        })
        setFilters(tempObj)
        setTypes(response.data)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const fetchAllFuelTypes = async () => {
    try {
      const response = await axios.get(url + 'api/listings/fuel')
      if (response.data) {
        response.data.sort()
        const tempObj = [...filters]
        const index = tempObj.findIndex((item) => item.id == 'fuelType')
        
        const fuelParams = searchParams.getAll('fuelType')
        
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: fuelParams.includes(item),
          }
        })
        setFilters(tempObj)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const fetchAllTransmissionTypes = async () => {
    try {
      const response = await axios.get(url + 'api/listings/transmission')
      if (response.data) {
        response.data.sort()
        const tempObj = [...filters]
        const index = tempObj.findIndex((item) => item.id == 'transmissionType')
        
        const transParams = searchParams.getAll('transmissionType')
        
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: transParams.includes(item),
          }
        })
        setFilters(tempObj)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const fetchAllSeats = async () => {
    try {
      const response = await axios.get(url + 'api/listings/seats')
      if (response.data) {
        response.data.sort()
        const tempObj = [...filters]
        const index = tempObj.findIndex((item) => item.id == 'seats')
        
        const seatParams = searchParams.getAll('seats')
        
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: seatParams.includes(item.toString()), // Params are strings
          }
        })
        setFilters(tempObj)
        setSeatsCount(response.data)
      }
    } catch (e) {
      console.log(e.message)
    }
  }
  
  // Update static options (Budget, Owners, KM) based on URL
  useEffect(() => {
      const tempFilters = [...filters]
      
      // Budget
      const budgetParams = searchParams.getAll('budget')
      const budgetIndex = tempFilters.findIndex(i => i.id === 'budget')
      tempFilters[budgetIndex].options.forEach(opt => {
          opt.checked = budgetParams.includes(opt.value)
      })
      
      // Owners
      const ownerParams = searchParams.getAll('ownership')
      const ownerIndex = tempFilters.findIndex(i => i.id === 'ownership')
      tempFilters[ownerIndex].options.forEach(opt => {
          opt.checked = ownerParams.includes(opt.value.toString())
      })
      
      // KM Driven
      const kmParams = searchParams.getAll('kmDriven')
      const kmIndex = tempFilters.findIndex(i => i.id === 'kmDriven')
      tempFilters[kmIndex].options.forEach(opt => {
          opt.checked = kmParams.includes(opt.value)
      })
      
      // Year Slider
      const yearParam = searchParams.get('modelYear')
      if (yearParam) {
          const [min, max] = yearParam.split('-').map(Number)
          const yearIndex = tempFilters.findIndex(i => i.id === 'modelYear')
          tempFilters[yearIndex].config.value = [min, max]
      }
      
      setFilters(tempFilters)
  }, [searchParams])

  return (
    <div className="bg-custom-black min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            className="relative z-50 lg:hidden"
            onClose={setMobileFiltersOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
            </Transition.Child>

            <div className="fixed inset-0 z-50 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-custom-jet shadow-xl py-4 pb-6 border-l border-white/10">
                  <div className="flex items-center justify-between px-4 pb-4 border-b border-white/10">
                    <h2 className="text-lg font-display font-bold text-white">
                      {t('buy.filters.title')}
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white/5 p-2 text-custom-platinum hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 flex-1 px-4">
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-b border-white/10 py-6 last:border-none"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-transparent py-3 text-sm text-custom-platinum hover:text-white transition-colors">
                                <span className="font-medium text-white text-base">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5 text-custom-accent"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5 text-custom-platinum"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              <div className="space-y-4">
                                {section.type == 'slider' ? (
                                  <div className="px-2">
                                    <Slider
                                      range
                                      defaultValue={section.config.value}
                                      min={section.config.min}
                                      max={section.config.max}
                                      step={section.config.step}
                                      trackStyle={[{ backgroundColor: '#EAB308' }]}
                                      handleStyle={[
                                        { borderColor: '#EAB308', backgroundColor: '#EAB308' },
                                        { borderColor: '#EAB308', backgroundColor: '#EAB308' }
                                      ]}
                                      railStyle={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                      tooltip={{
                                        placement: 'bottom',
                                        formatter: section.id != 'modelYear' && sliderFormatter,
                                      }}
                                      onChange={(val) => handleSliderChange(section.id, val)}
                                    />
                                    <div className="flex justify-between text-xs text-custom-platinum mt-2">
                                      <span>{section.id === 'modelYear' ? section.config.min : AmountWithCommas(section.config.min)}</span>
                                      <span>{section.id === 'modelYear' ? section.config.max : AmountWithCommas(section.config.max)}</span>
                                    </div>
                                  </div>
                                ) : (
                                  section.options.map((option, optionIdx) => (
                                    <div key={option.value} className="flex items-center group">
                                      <input
                                        id={`filter-mobile-${section.id}-${optionIdx}`}
                                        name={`${section.id}[]`}
                                        defaultValue={option.value}
                                        type="checkbox"
                                        defaultChecked={option.checked}
                                        onChange={(e) =>
                                          handleCheckboxChange(
                                            section.id,
                                            option.label,
                                            e.target.checked,
                                          )
                                        }
                                        className="h-5 w-5 rounded border-custom-platinum/30 bg-custom-black text-custom-accent focus:ring-custom-accent focus:ring-offset-custom-black cursor-pointer"
                                      />
                                      <label
                                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                        className="ml-3 min-w-0 flex-1 text-custom-platinum group-hover:text-white transition-colors cursor-pointer"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))
                                )}
                              </div>
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                  
                  <div className="sticky bottom-0 bg-custom-jet border-t border-white/10 p-4 space-y-3">
                    <Button
                      onClick={() => updateFilters()}
                      className="w-full !bg-custom-accent hover:!bg-yellow-400 !text-custom-black !font-bold !h-12 !rounded-xl !text-base shadow-lg shadow-custom-accent/20"
                    >
                      {t('buy.filters.apply')}
                    </Button>
                    <Button
                      onClick={() => {
                        setSearchQuery('')
                        clearFilters()
                      }}
                      className="w-full !bg-white/5 hover:!bg-white/10 !text-white !border-white/10 !h-12 !rounded-xl !text-base"
                    >
                      {t('buy.filters.clear')}
                    </Button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="pb-24 pt-24">
          <div className="flex items-baseline justify-between border-b border-white/10 pb-6 pt-12">
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight text-white">
              {t('buy.title')}
            </h1>

            <div className="flex items-center gap-4">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center items-center text-sm font-medium text-custom-platinum hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10">
                    {t('buy.sort.label')}
                    <ChevronDownIcon
                      className="-mr-1 ml-2 h-5 w-5 flex-shrink-0 text-custom-platinum group-hover:text-white"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-custom-jet border border-white/10 shadow-2xl focus:outline-none overflow-hidden">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              onClick={() => handleSort(option.param)}
                              className={classNames(
                                option.current
                                  ? 'font-medium text-white bg-white/10'
                                  : 'text-custom-platinum',
                                active ? 'bg-white/5 text-white' : '',
                                'block px-4 py-3 text-sm cursor-pointer transition-colors'
                              )}
                            >
                              {option.name}
                            </a>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              
              <button
                type="button"
                className="-m-2 ml-2 p-2 text-custom-platinum hover:text-white lg:hidden bg-white/5 rounded-lg border border-white/10"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pb-24 pt-6">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
              {/* Filters (Desktop) */}
              <form className="hidden lg:block sticky top-24 h-fit space-y-6 bg-custom-jet/30 backdrop-blur-md p-6 rounded-2xl border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">Filters</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      clearFilters()
                    }}
                    className="text-xs text-custom-accent hover:text-yellow-400 font-medium transition-colors"
                  >
                    Reset All
                  </button>
                </div>
                
                {filters.map((section) => (
                  <Disclosure as="div" key={section.id} className="border-b border-white/10 py-6 last:border-none last:pb-0">
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-transparent py-3 text-sm text-custom-platinum hover:text-white transition-colors">
                            <span className="font-medium text-white">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon className="h-5 w-5 text-custom-accent" aria-hidden="true" />
                              ) : (
                                <PlusIcon className="h-5 w-5 text-custom-platinum" aria-hidden="true" />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.type == 'slider' ? (
                              <div className="px-2">
                                <Slider
                                  range
                                  defaultValue={section.config.value}
                                  min={section.config.min}
                                  max={section.config.max}
                                  step={section.config.step}
                                  trackStyle={[{ backgroundColor: '#EAB308' }]}
                                  handleStyle={[
                                    { borderColor: '#EAB308', backgroundColor: '#EAB308' },
                                    { borderColor: '#EAB308', backgroundColor: '#EAB308' }
                                  ]}
                                  railStyle={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                                  tooltip={{
                                    placement: 'bottom',
                                    formatter: section.id != 'modelYear' && sliderFormatter,
                                  }}
                                  onChange={(val) => handleSliderChange(section.id, val)}
                                />
                                <div className="flex justify-between text-xs text-custom-platinum mt-2">
                                  <span>{section.id === 'modelYear' ? section.config.min : AmountWithCommas(section.config.min)}</span>
                                  <span>{section.id === 'modelYear' ? section.config.max : AmountWithCommas(section.config.max)}</span>
                                </div>
                              </div>
                            ) : (
                              section.options.map((option, optionIdx) => (
                                <div key={option.value} className="flex items-center group">
                                  <input
                                    id={`filter-${section.id}-${optionIdx}`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.value}
                                    type="checkbox"
                                    defaultChecked={option.checked}
                                    onChange={(e) =>
                                      handleCheckboxChange(
                                        section.id,
                                        option.label,
                                        e.target.checked,
                                      )
                                    }
                                    className="h-4 w-4 rounded border-custom-platinum/30 bg-custom-black text-custom-accent focus:ring-custom-accent focus:ring-offset-custom-black cursor-pointer"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-custom-platinum group-hover:text-white transition-colors cursor-pointer"
                                  >
                                    {option.label}
                                  </label>
                                </div>
                              ))
                            )}
                          </div>
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                ))}
                
                <Button
                  onClick={() => updateFilters()}
                  className="w-full !bg-custom-accent hover:!bg-yellow-400 !text-custom-black !font-bold !h-10 !rounded-lg mt-4 shadow-lg shadow-custom-accent/20"
                >
                  {t('buy.filters.apply')}
                </Button>
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    updateFilters()
                  }}
                  className="mb-8"
                >
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FaSearch className="text-custom-platinum" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search cars by brand, model, or variant..."
                        className="block w-full pl-11 pr-4 py-3 bg-custom-jet/50 border border-white/10 rounded-xl text-white placeholder-custom-platinum focus:outline-none focus:border-custom-accent focus:ring-1 focus:ring-custom-accent transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault()
                        updateFilters()
                      }}
                      className="px-6 py-3 bg-custom-accent text-custom-black font-bold rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-custom-accent/20"
                    >
                      Search
                    </button>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery('')
                          updateFilters(null, true)
                        }}
                        className="px-4 py-3 bg-white/5 text-white border border-white/10 rounded-xl hover:bg-white/10 transition-all"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </form>

                {loading ? (
                  <div className="flex items-center justify-center h-64">
                    <Oval
                      color="#F59E0B"
                      height={50}
                      width={50}
                      secondaryColor="#78350f"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.length ? (
                      listings.map((car) => (
                        <FeaturedCard key={car._id} car={car} />
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-20 text-center bg-custom-jet/20 rounded-3xl border border-white/5">
                        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                          <FaSearch className="text-2xl text-custom-platinum" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">No vehicles found</h3>
                        <p className="text-custom-platinum max-w-md">
                          Try adjusting your filters or search query to find what you're looking for.
                        </p>
                        <button
                          onClick={() => {
                            setSearchQuery('')
                            clearFilters()
                          }}
                          className="mt-6 text-custom-accent hover:text-yellow-400 font-medium underline underline-offset-4"
                        >
                          Clear all filters
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
