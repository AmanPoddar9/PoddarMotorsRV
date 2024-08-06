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
import { AmountWithCommas } from '@/app/utils'
import FeaturedCard from '@/app/components/FeaturedCard'
import { FaSearch } from 'react-icons/fa'

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
let url = 'https://poddar-motors-rv-hkxu.vercel.app/'
// url = 'http://localhost:5000/'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Buy({ allListings }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [brands, setBrands] = useState([])
  const [types, setTypes] = useState([])
  const [listings, setListings] = useState([])
  const [filteredListings, setFilteredListings] = useState([])

  const [seatsCount, setSeatsCount] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState([
    {
      id: 'brand',
      name: 'Brand',
      options: [],
    },
    {
      id: 'type',
      name: 'Segment',
      options: [],
    },
    {
      id: 'budget',
      name: 'Budget',
      options: [
        { value: '0-400000', label: 'Under 4 Lakhs', checked: false },
        { value: '400000-800000', label: '4-8 Lakhs', checked: false },
        { value: '800000-1200000', label: '8-12 Lakhs', checked: false },
        { value: '1200000', label: 'Above 12 Lakhs', checked: false },
      ],
    },
    {
      id: 'modelYear',
      name: 'Year',
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
      name: 'Fuel Type',
      options: [],
    },
    {
      id: 'transmissionType',
      name: 'Transmission',
      options: [],
    },
    {
      id: 'ownership',
      name: 'Owners',
      options: [
        { value: 1, label: '1', checked: false },
        { value: 2, label: '2', checked: false },
        { value: 3, label: '3', checked: false },
        { value: 4, label: '4', checked: false },
      ],
    },
    {
      id: 'kmDriven',
      name: 'KM Driven',
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
    localStorage.removeItem('filters')
    window.location.reload()
  }

  const updateFilters = async (inputFilters, clear) => {
    setMobileFiltersOpen(false)
    setLoading(true)
    let obj = {}
    if (inputFilters) {
      obj = inputFilters
    } else {
      filters.map((filter) => {
        const key = filter['id']
        let tempArr = []
        if (filter['type'] == 'slider') {
          tempArr = filter['config']['value']
        } else {
          filter['options'].map((opt) => {
            if (opt['checked'] == true) {
              tempArr.push(opt['value'])
            }
          })
        }
        if (tempArr.length) {
          obj[key] = tempArr
        }
      })
    }
    if (searchQuery.length > 0 && !clear) {
      obj['search'] = searchQuery
    }
    try {
      const response = await axios.post(url + 'api/listings/filtered', obj)
      setListings(response.data)
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
        let checkedBrands = []
        if (localStorage.getItem('filters')) {
          const filtersObj = JSON.parse(localStorage.getItem('filters'))
          const brand = filtersObj['Brand']
          if (brand) {
            checkedBrands.push(brand)
          }
        }
        const index = tempObj.findIndex((item) => item.id == 'brand')
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: checkedBrands.includes(item),
          }
        })
        setFilters(tempObj)

        setBrands(response.data)
      }
    } catch (e) {
      console.log(e.message)
    }
  }
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

  const updateCheckedPrices = () => {
    if (localStorage.getItem('filters')) {
      const filtersObj = JSON.parse(localStorage.getItem('filters'))
      const price = filtersObj['Budget']

      const tempFilters = [...filters]
      const priceIndex = tempFilters.findIndex((item) => item.id == 'budget')

      let newOptions = []
      if (price) {
        let priceObj = tempFilters[priceIndex]['options'].find(
          (item) => item.value == price,
        )
        if (priceObj) {
          newOptions = tempFilters[priceIndex]['options'].map((item) => {
            let tempItem = { ...item }
            if (item['value'] == price) {
              tempItem['checked'] = true
            }
            return tempItem
          })
        } else {
          newOptions = tempFilters[priceIndex]['options'].map((item, index) => {
            let tempItem = { ...item }
            if (index >= 2) {
              tempItem['checked'] = true
            }
            return tempItem
          })
        }
        tempFilters[priceIndex]['options'] = newOptions
        setFilters(tempFilters)
      }
    }
  }

  const carTypes = [
    'Micro Car',
    'Hatchback',
    'Compact Sedan',
    'Mid Size Sedan',
    'Full Size Sedan',
    'Compact SUV',
    'Mid Size SUV',
    'Full Size SUV',
    'MUV/MPV',
    'Luxury',
  ]

  const fetchAllTypes = async () => {
    try {
      const response = await axios.get(url + 'api/listings/types')
      if (response.data) {
        const tempObj = [...filters]
        const index = tempObj.findIndex((item) => item.id == 'type')
        let checkedSegments = []
        if (localStorage.getItem('filters')) {
          const filtersObj = JSON.parse(localStorage.getItem('filters'))
          const type = filtersObj['Segment']
          if (type) {
            checkedSegments.push(type)
          }
        }
        response.data.sort((a, b) => {
          return carTypes.indexOf(a) - carTypes.indexOf(b)
        })
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: checkedSegments.includes(item),
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
        let checkedSegments = []
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: checkedSegments.includes(item),
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
        let checkedSegments = []
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: checkedSegments.includes(item),
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
        tempObj[index]['options'] = response.data.map((item) => {
          return {
            value: item,
            label: item,
            checked: false,
          }
        })
        setFilters(tempObj)
        setSeatsCount(response.data)
      }
    } catch (e) {
      console.log(e.message)
    }
  }

  const fetchInitialFilteredListings = () => {
    const filtersObj = JSON.parse(localStorage.getItem('filters'))
    const brand = filtersObj['Brand']
    const type = filtersObj['Segment']
    const budget = filtersObj['Budget']
    let newFiltersObj = {}
    if (brand) {
      newFiltersObj['brand'] = [brand]
    }
    if (type) {
      newFiltersObj['type'] = [type]
    }
    if (budget) {
      newFiltersObj['budget'] = [budget]
    }
    updateFilters(newFiltersObj)
  }
  useEffect(() => {
    if (localStorage.getItem('filters')) {
      fetchInitialFilteredListings()
    } else {
      if (allListings) {
        setListings(allListings)
      } else {
        fetchAllListings()
      }
    }
    fetchAllBrands()
    fetchAllTypes()
    fetchAllSeats()
    fetchAllFuelTypes()
    fetchAllTransmissionTypes()
    updateCheckedPrices()
  }, [])

  return (
    <div className="bg-white buyCarsSection">
      <div className="mx-auto max-w-screen-xl">
        {/* Mobile filter dialog */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog
            className="relative z-40 lg:hidden"
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
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl pt-20">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">
                      Filters
                    </h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Filters */}
                  <form className="mt-4 border-t border-gray-200">
                    <h3 className="sr-only">Categories</h3>
                    {filters.map((section) => (
                      <Disclosure
                        as="div"
                        key={section.id}
                        className="border-t border-gray-200 px-4 py-6"
                      >
                        {({ open }) => (
                          <>
                            <h3 className="-mx-2 -my-3 flow-root">
                              <Disclosure.Button className="flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500">
                                <span className="font-medium text-gray-900">
                                  {section.name}
                                </span>
                                <span className="ml-6 flex items-center">
                                  {open ? (
                                    <MinusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                              </Disclosure.Button>
                            </h3>
                            <Disclosure.Panel className="pt-6">
                              {section.type == 'slider' ? (
                                <div className="space-y-6 w-[90%] ml-[5%]">
                                  <Slider
                                    range
                                    defaultValue={section.config.value}
                                    min={section.config.min}
                                    max={section.config.max}
                                    step={section.config.step}
                                    tooltip={{
                                      placement: 'bottom',
                                      // open: true,
                                      formatter:
                                        section.id != 'modelYear' &&
                                        sliderFormatter,
                                    }}
                                    onChange={(val) =>
                                      handleSliderChange(section.id, val)
                                    }
                                  />
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  {section.options.map((option, optionIdx) => (
                                    <div
                                      key={option.value}
                                      className="flex items-center"
                                    >
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
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                      />
                                      <label
                                        htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                                        className="ml-3 min-w-0 flex-1 text-gray-500"
                                      >
                                        {option.label}
                                      </label>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </Disclosure.Panel>
                          </>
                        )}
                      </Disclosure>
                    ))}
                  </form>
                  <Button
                    onClick={() => updateFilters()}
                    className="w-[80%] mx-auto !bg-custom-yellow mt-4"
                  >
                    Filter
                  </Button>
                  <Button
                    onClick={() => {
                      setSearchQuery('')
                      clearFilters()
                    }}
                    className="mt-4 w-[80%] mx-auto !bg-custom-seasalt "
                  >
                    Clear Filters
                  </Button>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        <main className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-12">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Explore all cars
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sort
                    <ChevronDownIcon
                      className="-mr-5 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
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
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <a
                              onClick={() => handleSort(option.param)}
                              className={classNames(
                                option.current
                                  ? 'font-medium text-gray-900'
                                  : 'text-gray-500',
                                active ? 'bg-gray-100' : '',
                                'block px-4 py-2 text-sm',
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
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
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

            <div
              className="flex flex-col md:flex-row lg:gap-x-12 justify-center relative"
              style={{ alignSelf: 'center' }}
            >
              {/* Filters */}
              <form
                className="hidden lg:block max-h-[70vh] overflow-y-auto"
                style={{
                  flexGrow: 3,
                  paddingRight: '14px',
                }}
              >
                <h3 className="sr-only">Categories</h3>
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.id}
                    className="border-b border-gray-200 py-6"
                  >
                    {({ open }) => (
                      <>
                        <h3 className="-my-3 flow-root">
                          <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                            <span className="font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex items-center">
                              {open ? (
                                <MinusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              ) : (
                                <PlusIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              )}
                            </span>
                          </Disclosure.Button>
                        </h3>
                        <Disclosure.Panel className="pt-6">
                          <div className="space-y-4">
                            {section.type == 'slider' ? (
                              <div className="space-y-6 w-[90%] ml-[5%]">
                                <Slider
                                  range
                                  defaultValue={section.config.value}
                                  min={section.config.min}
                                  max={section.config.max}
                                  step={section.config.step}
                                  tooltip={{
                                    placement: 'bottom',
                                    // open: true,
                                    formatter:
                                      section.id != 'modelYear' &&
                                      sliderFormatter,
                                  }}
                                  onChange={(val) =>
                                    handleSliderChange(section.id, val)
                                  }
                                />
                              </div>
                            ) : (
                              section.options.map((option, optionIdx) => (
                                <div
                                  key={option.value}
                                  className="flex items-center"
                                >
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
                                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                  />
                                  <label
                                    htmlFor={`filter-${section.id}-${optionIdx}`}
                                    className="ml-3 text-sm text-gray-600"
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
                  className="w-[100%] !bg-custom-yellow mt-4 !hover:text-white"
                >
                  Filter
                </Button>
                <Button
                  onClick={() => clearFilters()}
                  className="w-[100%]  mt-4 !hover:text-white"
                >
                  Clear Filters
                </Button>
              </form>

              <div className="lg:w-[75%] w-[100%] ">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    updateFilters()
                  }}
                >
                  <div className="flex justify-center items-center py-4 px-2 md:px-10">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search cars by brand/model..."
                      className="border rounded-l-md p-2 w-[100%]"
                    />
                    <button
                      type="submit"
                      onClick={(e) => {
                        e.preventDefault()
                        updateFilters()
                      }}
                      className="items-center 
                justify-center
                px-3 py-3  ml-2 text-base
                 font-medium 
                 text-center border 
                 rounded-lg 
                 text-custom-black hover:text-custom-jet focus:ring-4  !hover:border-custom-jet !bg-custom-yellow"
                    >
                      <FaSearch />
                    </button>

                    <button
                      onClick={() => {
                        setSearchQuery('')
                        updateFilters(null, true)
                      }}
                      className="bg-custom-platinum text-custom-jet  py-2 px-4 ml-2 rounded-md"
                    >
                      Clear
                    </button>
                  </div>
                </form>
                {loading ? (
                  <div className="flex items-center justify-center p-2 h-[60%]">
                    <Oval
                      color="#fded03"
                      height={50}
                      width={50}
                      secondaryColor="#b45309"
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fit, minmax(300px, 1fr))',
                    }}
                    className="py-10 px-2 md:px-10 lg:gap-x-4 gap-y-10 w-[100%]  max-h-[70vh] overflow-y-auto"
                  >
                    {listings.length ? (
                      listings.map((car) => (
                        <FeaturedCard key={car._id} car={car} />
                      ))
                    ) : (
                      <div className="text-center font-semibold p-4 lg:col-span-4">
                        Sorry, no vehicles match the filters set...
                      </div>
                    )}
                  </div>
                )}
                {/* Product grid */}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
