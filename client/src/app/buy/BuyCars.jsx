'use client'
import { Fragment, useState, useEffect, useCallback, useMemo } from 'react'
import { Dialog, Disclosure, Menu, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
} from '@heroicons/react/20/solid'
import axios from 'axios'
import { Button, Slider } from 'antd'
import { AmountWithCommas } from '@/app/utils'
import FeaturedCard from '@/app/components/FeaturedCard'
import { FaSearch } from 'react-icons/fa'
import { Oval } from 'react-loader-spinner'
import Head from 'next/head'

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

function FilterSection({ section, handleCheckboxChange, handleSliderChange }) {
  return (
    <Disclosure
      as="div"
      key={section.id}
      className="border-b border-gray-200 py-6"
    >
      {({ open }) => (
        <>
          <h3 className="-my-3 flow-root">
            <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
              <span className="font-medium text-gray-900">{section.name}</span>
              <span className="ml-6 flex items-center">
                {open ? (
                  <MinusIcon className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <PlusIcon className="h-5 w-5" aria-hidden="true" />
                )}
              </span>
            </Disclosure.Button>
          </h3>
          <Disclosure.Panel className="pt-6">
            {section.type === 'slider' ? (
              <div className="space-y-6 w-[90%] ml-[5%]">
                <Slider
                  range
                  defaultValue={section.config.value}
                  min={section.config.min}
                  max={section.config.max}
                  step={section.config.step}
                  tooltip={{
                    placement: 'bottom',
                    formatter: section.id !== 'modelYear' && sliderFormatter,
                  }}
                  onChange={(val) => handleSliderChange(section.id, val)}
                />
              </div>
            ) : (
              <div className="space-y-6">
                {section.options.map((option, optionIdx) => (
                  <div key={option.value} className="flex items-center">
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
  )
}

function sortListings(listings, key, order) {
  const tempListings = [...listings]
  tempListings.sort((a, b) => {
    if (order === 'asc') {
      return a[key] - b[key]
    } else if (order === 'desc') {
      return b[key] - a[key]
    }
    return 0
  })
  return tempListings
}

export default function Buy({ allListings }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [brands, setBrands] = useState([])
  const [types, setTypes] = useState([])
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState([
    { id: 'brand', name: 'Brand', options: [] },
    { id: 'type', name: 'Segment', options: [] },
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
    { id: 'fuelType', name: 'Fuel Type', options: [] },
    { id: 'transmissionType', name: 'Transmission', options: [] },
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
    { id: 'seats', name: 'Seats', options: [] },
  ])

  const updateFilters = useCallback(
    async (inputFilters, clear) => {
      setMobileFiltersOpen(false)
      setLoading(true)
      let obj = {}
      if (inputFilters) {
        obj = inputFilters
      } else {
        filters.map((filter) => {
          const key = filter['id']
          let tempArr = []
          if (filter['type'] === 'slider') {
            tempArr = filter['config']['value']
          } else {
            filter['options'].map((opt) => {
              if (opt['checked'] === true) {
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
    },
    [filters, searchQuery],
  )

  const fetchAllListings = useCallback(async () => {
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
  }, [])

  const fetchAllBrands = useCallback(async () => {
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
            checkedBrands = brand
          }
        }
        tempObj[0]['options'] = response.data.map((brand) => {
          return {
            value: brand,
            label: brand,
            checked: checkedBrands.includes(brand) ? true : false,
          }
        })
        setBrands(response.data)
        setFilters(tempObj)
      }
    } catch (e) {
      console.log(e.message)
    }
  }, [filters])

  const fetchAllTypes = useCallback(async () => {
    try {
      const response = await axios.get(url + 'api/listings/types')
      if (response.data) {
        response.data.sort()
        const tempObj = [...filters]
        let checkedTypes = []
        if (localStorage.getItem('filters')) {
          const filtersObj = JSON.parse(localStorage.getItem('filters'))
          const type = filtersObj['Type']
          if (type) {
            checkedTypes = type
          }
        }
        tempObj[1]['options'] = response.data.map((type) => {
          return {
            value: type,
            label: type,
            checked: checkedTypes.includes(type) ? true : false,
          }
        })
        setTypes(response.data)
        setFilters(tempObj)
      }
    } catch (e) {
      console.log(e.message)
    }
  }, [filters])

  const fetchAllFuelTypes = useCallback(async () => {
    try {
      const response = await axios.get(url + 'api/listings/fuelTypes')
      if (response.data) {
        const tempObj = [...filters]
        let checkedTypes = []
        if (localStorage.getItem('filters')) {
          const filtersObj = JSON.parse(localStorage.getItem('filters'))
          const fuelType = filtersObj['Fuel Type']
          if (fuelType) {
            checkedTypes = fuelType
          }
        }
        tempObj[4]['options'] = response.data.map((fuelType) => {
          return {
            value: fuelType,
            label: fuelType,
            checked: checkedTypes.includes(fuelType) ? true : false,
          }
        })
        setFilters(tempObj)
      }
    } catch (e) {
      console.log(e.message)
    }
  }, [filters])

  const fetchAllTransmissionTypes = useCallback(async () => {
    try {
      const response = await axios.get(url + 'api/listings/transmissionTypes')
      if (response.data) {
        const tempObj = [...filters]
        let checkedTypes = []
        if (localStorage.getItem('filters')) {
          const filtersObj = JSON.parse(localStorage.getItem('filters'))
          const transmissionType = filtersObj['Transmission Type']
          if (transmissionType) {
            checkedTypes = transmissionType
          }
        }
        tempObj[5]['options'] = response.data.map((transmissionType) => {
          return {
            value: transmissionType,
            label: transmissionType,
            checked: checkedTypes.includes(transmissionType) ? true : false,
          }
        })
        setFilters(tempObj)
      }
    } catch (e) {
      console.log(e.message)
    }
  }, [filters])

  const fetchAllSeats = useCallback(async () => {
    try {
      const response = await axios.get(url + 'api/listings/seats')
      if (response.data) {
        const tempObj = [...filters]
        let checkedTypes = []
        if (localStorage.getItem('filters')) {
          const filtersObj = JSON.parse(localStorage.getItem('filters'))
          const seats = filtersObj['Seats']
          if (seats) {
            checkedTypes = seats
          }
        }
        tempObj[8]['options'] = response.data.map((seat) => {
          return {
            value: seat,
            label: seat,
            checked: checkedTypes.includes(seat) ? true : false,
          }
        })
        setFilters(tempObj)
      }
    } catch (e) {
      console.log(e.message)
    }
  }, [filters])

  useEffect(() => {
    fetchAllListings()
    fetchAllBrands()
    fetchAllTypes()
    fetchAllFuelTypes()
    fetchAllTransmissionTypes()
    fetchAllSeats()
  }, [
    fetchAllListings,
    fetchAllBrands,
    fetchAllTypes,
    fetchAllFuelTypes,
    fetchAllTransmissionTypes,
    fetchAllSeats,
  ])

  const handleSort = useCallback(
    (sortParam) => {
      let key = 'price'
      let order = 'asc'
      if (sortParam.includes('price')) {
        key = 'price'
      } else if (sortParam.includes('kmDriven')) {
        key = 'kmDriven'
      } else if (sortParam.includes('year')) {
        key = 'year'
      }
      if (sortParam.includes('desc')) {
        order = 'desc'
      }
      const sortedListings = sortListings(listings, key, order)
      setListings(sortedListings)
    },
    [listings],
  )

  const clearFilters = useCallback(() => {
    localStorage.removeItem('filters')
    window.location.reload()
  }, [])

  const handleCheckboxChange = useCallback(
    (id, label, checked) => {
      const tempFilters = [...filters]
      tempFilters.forEach((filter) => {
        if (filter.id === id) {
          filter.options.forEach((option) => {
            if (option.label === label) {
              option.checked = checked
            }
          })
        }
      })
      setFilters(tempFilters)
      updateFilters(tempFilters)
    },
    [filters, updateFilters],
  )

  const handleSliderChange = useCallback(
    (id, value) => {
      const tempFilters = [...filters]
      tempFilters.forEach((filter) => {
        if (filter.id === id) {
          filter.config.value = value
        }
      })
      setFilters(tempFilters)
      updateFilters(tempFilters)
    },
    [filters, updateFilters],
  )

  const sliderFormatter = useCallback(
    (value) => `₹${AmountWithCommas(value)}`,
    [],
  )

  const filteredListings = useMemo(
    () =>
      listings.filter((listing) => {
        if (searchQuery.length === 0) return true
        return (
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      }),
    [listings, searchQuery],
  )

  return (
    <>
      <Head>
        <title>Buy Used Cars in Ranchi, Jharkhand | Real Value</title>
        <meta
          name="description"
          content="Explore a wide range of quality used cars in Ranchi, Jharkhand. Find the best deals on pre-owned cars at Real Value."
        />
        <meta
          name="keywords"
          content="used cars, pre-owned cars, buy used cars, used cars Ranchi, Real Value"
        />
      </Head>
      <div className="bg-white">
        <div>
          <MobileFilterDialog
            mobileFiltersOpen={mobileFiltersOpen}
            setMobileFiltersOpen={setMobileFiltersOpen}
            filters={filters}
            handleCheckboxChange={handleCheckboxChange}
            handleSliderChange={handleSliderChange}
            clearFilters={clearFilters}
          />
          <MainSection
            filters={filters}
            handleSort={handleSort}
            setSearchQuery={setSearchQuery}
            clearFilters={clearFilters}
            filteredListings={filteredListings}
            loading={loading}
          />
        </div>
      </div>
    </>
  )
}

function MobileFilterDialog({
  mobileFiltersOpen,
  setMobileFiltersOpen,
  filters,
  handleCheckboxChange,
  handleSliderChange,
  clearFilters,
}) {
  return (
    <Transition.Root show={mobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
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
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500"
                  onClick={() => setMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <form className="mt-4 space-y-6">
                {filters.map((section) => (
                  <FilterSection
                    key={section.id}
                    section={section}
                    handleCheckboxChange={handleCheckboxChange}
                    handleSliderChange={handleSliderChange}
                  />
                ))}
              </form>

              <div className="flex items-center justify-between p-4">
                <Button onClick={clearFilters}>Clear All</Button>
                <Button onClick={() => setMobileFiltersOpen(false)}>
                  Apply Filters
                </Button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

function MainSection({
  filters,
  handleSort,
  setSearchQuery,
  clearFilters,
  filteredListings,
  loading,
}) {
  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="border-b border-gray-200 pb-10 pt-24">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          Buy Used Cars
        </h1>
        <div className="flex items-center justify-between pt-6">
          <Menu as="div" className="relative inline-block text-left">
            <div>
              <Menu.Button className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
                Sort
                <ChevronDownIcon
                  className="ml-2 h-5 w-5 text-gray-400"
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
              <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <Menu.Item key={option.name}>
                      {({ active }) => (
                        <a
                          href={option.href}
                          onClick={() => handleSort(option.param)}
                          className={classNames(
                            active ? 'bg-gray-100' : '',
                            'block px-4 py-2 text-sm text-gray-700',
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

          <div className="relative flex items-center">
            <input
              type="text"
              name="search"
              id="search"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for cars"
              className="block w-full rounded-md border-gray-300 pr-10 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <FaSearch
              className="absolute right-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <section aria-labelledby="products-heading" className="pb-24 pt-6">
        <h2 id="products-heading" className="sr-only">
          Products
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
          <div className="hidden lg:block">
            <h3 className="sr-only">Filters</h3>
            <form className="space-y-10 divide-y divide-gray-200">
              {filters.map((section) => (
                <FilterSection
                  key={section.id}
                  section={section}
                  handleCheckboxChange={handleCheckboxChange}
                  handleSliderChange={handleSliderChange}
                />
              ))}
              <div className="flex items-center justify-between p-4">
                <Button onClick={clearFilters}>Clear All</Button>
                <Button onClick={() => updateFilters(null, true)}>
                  Apply Filters
                </Button>
              </div>
            </form>
          </div>
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Oval
                  height={80}
                  width={80}
                  color="#4fa94d"
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#4fa94d"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {filteredListings.map((listing) => (
                  <FeaturedCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
