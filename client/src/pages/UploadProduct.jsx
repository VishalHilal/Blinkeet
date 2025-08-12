import React, { useState } from 'react'
import { FaCloudUploadAlt, FaFileAlt } from "react-icons/fa";
import uploadImage from '../utils/UploadImage';
import Loading from '../components/Loading';
import ViewImage from '../components/ViewImage';
import { MdDelete } from "react-icons/md";
import { useSelector } from 'react-redux'
import { IoClose } from "react-icons/io5";
import AddFieldComponent from '../components/AddFieldComponent';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import AxiosToastError from '../utils/AxiosToastError';
import successAlert from '../utils/SuccessAlert';
import toast from 'react-hot-toast';
import { useEffect } from 'react';




const UploadProduct = () => {
  const [data,setData] = useState({
      name : "",
      image : [],
      category : [],
      subCategory : [],
      unit : "",
      stock : "",
      price : "",
      discount : "",
      description : "",
      more_details : {},
  })
  const [imageLoading,setImageLoading] = useState(false)
  const [ViewImageURL,setViewImageURL] = useState("")
  const allCategory = useSelector(state => state.product.allCategory)
  const [selectCategory,setSelectCategory] = useState("")
  const [selectSubCategory,setSelectSubCategory] = useState("")
  const allSubCategory = useSelector(state => state.product.allSubCategory)

  const [openAddField,setOpenAddField] = useState(false)
  const [fieldName,setFieldName] = useState("")
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [rtfFile, setRtfFile] = useState(null)
  const [status, setStatus] = useState('')
  const [foundFields, setFoundFields] = useState(new Set(['name', 'description', 'unit', 'stock', 'price', 'discount']))

  const handleChange = (e)=>{
    const { name, value} = e.target 

    // Special handling for price to maintain exact value
    if (name === 'price') {
        // Remove any non-numeric characters except decimal point
        const cleanValue = value.replace(/[^0-9.]/g, '');
        // Ensure only one decimal point
        const parts = cleanValue.split('.');
        const formattedValue = parts.length > 1 ? 
            `${parts[0]}.${parts.slice(1).join('')}` : 
            cleanValue;
        
        setData((preve)=>{
            return{
                ...preve,
                [name]: formattedValue
            }
        });
        return;
    }

    setData((preve)=>{
        return{
            ...preve,
            [name]  : value
        }
    })
  }

  const handleUploadImage = async(e)=>{
    const file = e.target.files[0]

    if(!file){
      return 
    }
    setImageLoading(true)
    const response = await uploadImage(file)
    console.log('Full upload response:', response)
    console.log('Response data:', response.data)
    console.log('Response data.data:', response.data?.data)
    let imageUrl = null
    if (response.data?.data?.url) {
        imageUrl = response.data.data.url
    } else if (response.data?.data?.secure_url) {
        imageUrl = response.data.data.secure_url
    } else if (response.data?.url) {
        imageUrl = response.data.url
    } else if (response.data?.data?.image?.url) {
        imageUrl = response.data.data.image.url
    }

    setData((preve)=>{
      return{
        ...preve,
        image : [...preve.image,imageUrl]
      }
    })
    setImageLoading(false)

  }

  const handleDeleteImage = async(index)=>{
      data.image.splice(index,1)
      setData((preve)=>{
        return{
            ...preve
        }
      })
  }

  const handleRemoveCategory = async(index)=>{
    data.category.splice(index,1)
    setData((preve)=>{
      return{
        ...preve
      }
    })
  }
  const handleRemoveSubCategory = async(index)=>{
      data.subCategory.splice(index,1)
      setData((preve)=>{
        return{
          ...preve
        }
      })
  }

  const handleAddField = () => {
    const normalizedFieldName = fieldName.toLowerCase().replace(/\s+/g, '')
    setData((preve) => {
        return {
            ...preve,
            more_details: {
                ...preve.more_details,
                [fieldName]: ""
            }
        }
    })
    setFoundFields(prev => new Set([...prev, normalizedFieldName]))
    setFieldName("")
    setOpenAddField(false)
  }

  const handleSubmit = async(e)=>{
    e.preventDefault()
    console.log("data",data)

    try {
      const response = await Axios({
          ...SummaryApi.createProduct,
          data : data
      })
      const { data : responseData} = response

      if(responseData.success){
          successAlert(responseData.message)
          setData({
            name : "",
            image : [],
            category : [],
            subCategory : [],
            unit : "",
            stock : "",
            price : "",
            discount : "",
            description : "",
            more_details : {},
          })

      }
    } catch (error) {
        let errorMessage = 'Failed to upload image'
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message
        } else if (error.message) {
            errorMessage = error.message
        }
        AxiosToastError(error)
    }


  }

  const handleProductSelect = (productData) => {
    // Reset select states
    setSelectCategory("")
    setSelectSubCategory("")

    // Update the form data with RTF data
    setData({
        name: productData.name || '',
        description: productData.description || '',
        unit: productData.unit || '',
        stock: productData.stock?.toString() || '', // Convert to string for input value
        price: productData.price?.toString() || '', // Convert to string for input value
        discount: productData.discount?.toString() || '', // Convert to string for input value
        category: productData.category || [],
        subCategory: productData.subCategory || [],
        image: productData.image || [],
        more_details: productData.more_details || {}
    })

    // Log the data to verify it's being set correctly
    console.log('Setting form data from RTF:', {
        name: productData.name,
        description: productData.description,
        unit: productData.unit,
        stock: productData.stock,
        price: productData.price,
        discount: productData.discount,
        category: productData.category,
        subCategory: productData.subCategory,
        image: productData.image,
        more_details: productData.more_details
    })
  }

  // Function to parse RTF content
  const parseRtfContent = async (rtfContent) => {
    try {
        console.log('=== Starting RTF Parsing Process ===')
        console.log('Raw RTF content:', rtfContent)

        // Remove RTF control characters and get plain text
        const plainText = rtfContent.replace(/\\[a-z0-9]+/g, '')
            .replace(/[{}]/g, '')
            .replace(/\\par/g, '\n')
            .replace(/\\tab/g, '\t')
            .trim()

        console.log('=== Cleaned Plain Text ===')
        console.log(plainText)

        // Define base section mappings
        const baseSectionMappings = {
            'Product Details': {
                type: 'header',
                fields: ['name', 'description'],
                descriptionOnly: false
            },
            'Description': {
                type: 'field',
                field: 'description',
                descriptionOnly: true,
                isMainDescription: true  // Add flag to identify main description
            },
            'Unit': {
                type: 'field',
                field: 'Unit'
            },
            'Type': {
                type: 'field',
                field: 'Type'
            },
            'Shelf Life': {
                type: 'field',
                field: 'Shelf Life'
            },
            'Country Of Origin': {
                type: 'field',
                field: 'Country Of Origin'
            },
            'FSSAI License': {
                type: 'field',
                field: 'FSSAILicense'
            },
            'Customer Care Details': {
                type: 'object',
                field: 'customerCare',
                subFields: ['email', 'phone', 'address']
            },
            'Return Policy': {
                type: 'field',
                field: 'Return Policy'
            },
            'Seller': {
                type: 'field',
                field: 'Seller'
            },
            'Seller FSSAI': {
                type: 'field',
                field: 'Seller FSSAI'
            },
            'Disclaimer': {
                type: 'field',
                field: 'disclaimer',
                isMultiline: true
            }
        }

        // Function to detect section headers in the text
        const detectSections = (text) => {
            // Split text into lines and find potential section headers
            const lines = text.split('\n')
            const sections = new Set()
            
            lines.forEach((line, index) => {
                // Skip empty lines
                if (!line.trim()) return
                
                // Check if this line is followed by empty line(s) and content
                const nextLine = lines[index + 1]
                if (nextLine && !nextLine.trim()) {
                    // This might be a section header
                    sections.add(line.trim())
                }
            })
            
            return Array.from(sections)
        }

        // Detect all sections in the text
        const detectedSections = detectSections(plainText)
        console.log('=== Detected Sections ===')
        console.log('Found sections:', detectedSections)

        // Create dynamic section mappings for new sections
        const dynamicSectionMappings = { ...baseSectionMappings }
        
        detectedSections.forEach(section => {
            const cleaned = section.trim()
        
            // Only create mappings for reasonable section headers
            if (
                !baseSectionMappings[cleaned] &&
                cleaned.length < 80 &&
                /^[A-Za-z0-9\s\-()&]+$/.test(cleaned)
            ) {
                const normalizedField = cleaned.toLowerCase().replace(/[^a-z0-9]+/g, '')
                dynamicSectionMappings[cleaned] = {
                    type: 'field',
                    field: normalizedField
                }
                console.log(`Created mapping for new section: "${cleaned}" -> "${normalizedField}"`)
            } else {
                console.warn(`❌ Skipped invalid section name: "${cleaned}"`)
            }
        })
        

        console.log('=== Final Section Mappings ===')
        console.log('Available sections:', Object.keys(dynamicSectionMappings))

        // Filter out invalid or too-long section names before building the regex
const validSectionNames = Object.keys(dynamicSectionMappings).filter(name => {
    return name.length < 80 && /^[A-Za-z0-9\s\-()&]+$/.test(name)  // Only include valid, reasonable names
})

// Create a regex pattern to match only valid section names
const sectionPattern = new RegExp(`(${validSectionNames.join('|')})`, 'g')


        // Find all section matches
        const matches = [...plainText.matchAll(sectionPattern)]
        console.log('=== Found Sections ===')
        console.log('Number of sections found:', matches.length)
        matches.forEach((match, index) => {
            console.log(`${index + 1}. Section: "${match[0]}" at position ${match.index}`)
        })

        // Initialize product object with default structure
        const product = {
            name: '',
            description: '',
            unit: '',
            price: '',
            stock: '',
            discount: '',
            category: [],
            subCategory: [],
            image: [],
            more_details: {}
        }

        // Create a Set to track found fields
        const foundSections = new Set(['name', 'description', 'unit', 'stock', 'price', 'discount'])

        console.log('=== Processing Sections ===')
        // Process each section
        matches.forEach((match, index) => {
            const sectionName = match[0] // the real discription is here
            // console.log("the section name of real",sectionName)
            const startIndex = match.index
            const endIndex = index < matches.length - 1 ? matches[index + 1].index : plainText.length
            let content = plainText.slice(startIndex + sectionName.length, endIndex).trim()
            // console.log("the disclaimer content",content)
            
            console.log(`\nProcessing section: "${sectionName}"`)
            console.log('Content:', content)

            const sectionConfig = dynamicSectionMappings[sectionName]
            console.log('############################ long  name of section' ,sectionConfig)
            if (!sectionConfig) {
                console.log('No mapping found for section:', sectionName)
                return
            }

            // Add section to found fields
            if (sectionConfig.field) {
                foundSections.add(sectionConfig.field)
                console.log('Added to found fields smaller:', sectionConfig.field)
            }

            // Initialize the field in more_details if it's a new section
            if (sectionConfig.type === 'field' && !product.more_details[sectionConfig.field]) {
                product.more_details[sectionConfig.field] = sectionName;
                console.log("the field is new &&&&&&&&&&&&&&&&&",product.more_details[sectionConfig.field])
            }

            switch(sectionConfig.type) {
                case 'header':
                    console.log('Processing header section')
                    const lines = content.split('\n').filter(line => line.trim())
                    if (lines.length > 0) {
                        product.name = lines[0]
                        console.log('Set name:', product.name)
                        if (!sectionConfig.descriptionOnly && lines.length > 1) {
                            const descriptionContent = lines.slice(1).join('\n').trim()
                            if (descriptionContent && !product.description) {
                                product.description = descriptionContent
                                console.log('Set description:', product.description)
                            }
                        }
                    }
                    break

                case 'field':
                    console.log('Processing field section:', sectionConfig.field)
                    if (sectionConfig.field === 'unit') {
                        product[sectionConfig.field] = content.trim()
                        console.log('Set unit:', product[sectionConfig.field])
                    } else if (sectionConfig.field === 'description') {
                        // Special handling for description field
                        if (content && !product.description) {  // Only set if not already set
                            // Clean up description content
                            const cleanedContent = content
                                .split('\n')
                                .map(line => line.trim())
                                .filter(line => line)
                                .join('\n\n')
                                .replace(/\n{3,}/g, '\n\n')
                                .trim()
                            
                            product.description = cleanedContent
                            console.log('Set main description:', product.description)
                            
                            // Remove description from more_details if it exists
                            if (product.more_details.description) {
                                delete product.more_details.description
                            }
                        }
                    } else if (sectionConfig.field === 'disclaimer') {
                        // Handle disclaimer like other fields
                        product.more_details[sectionConfig.field] = content
                            .split('\n')
                            .map(line => line.trim())
                            .filter(line => line)
                            .join('\n')
                        console.log('Set disclaimer:', product.more_details[sectionConfig.field])
                    } else {
                        // For all other fields, only add to more_details if not description
                        if (sectionConfig.field !== 'description') {
                            product.more_details[sectionConfig.field] = content.trim()
                            console.log(`Set ${sectionName}:`, product.more_details[sectionConfig.field])
                        }
                    }
                    break

                case 'object':
                    console.log('Processing object section:', sectionConfig.field)
                    if (!product.more_details[sectionConfig.field]) {
                        product.more_details[sectionConfig.field] = {}
                    }
                    const subFields = sectionConfig.subFields
                    subFields.forEach(field => {
                        // Improved regex pattern to better handle email and other fields
                        const regex = new RegExp(`${field}\\s*:?\\s*(.+?)(?=\\n|$)`, 'i')
                        const match = content.match(regex)
                        if (match) {
                            const value = match[1].trim()
                            // Special handling for email field
                            if (field === 'email') {
                                // Remove any extra spaces and ensure it's a valid email format
                                const emailValue = value.replace(/\s+/g, '').toLowerCase()
                                if (emailValue.includes('@')) {
                                    product.more_details[sectionConfig.field][field] = emailValue
                                    console.log(`Set ${field}:`, product.more_details[sectionConfig.field][field])
                                } else {
                                    console.warn(`Invalid email format: ${value}`)
                                }
                            } else {
                                product.more_details[sectionConfig.field][field] = value
                                console.log(`Set ${field}:`, product.more_details[sectionConfig.field][field])
                            }
                        }
                    })
                    break
            }
        })

        // Clean up description
        if (product.description) {
            product.description = product.description
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .join('\n\n')  // Use double newlines for better readability
                .replace(/\n{3,}/g, '\n\n')  // Replace 3 or more newlines with 2
                .trim()
            console.log('=== Final Cleaned Description ===')
            console.log(product.description)
        }

        // Clean up disclaimer
        if (product.more_details.disclaimer) {
            product.more_details.disclaimer = product.more_details.disclaimer
                .split('\n')
                .map(line => line.trim())
                .filter(line => line)
                .join('\n\n')  // Use double newlines for better readability
                .replace(/\n{3,}/g, '\n\n')  // Replace 3 or more newlines with 2
                .trim()
            console.log('=== Final Cleaned Disclaimer ===')
            console.log(product.more_details.disclaimer)
        }

        // Update found fields state        setFoundFields(foundSections)
        console.log('=== Final Found Fields ===')
        console.log(Array.from(foundSections))

        console.log('=== Final Parsed Product ===')
        console.log(JSON.stringify(product, null, 2))

        return product
    } catch (error) {
        console.error('Error parsing RTF:', error)
        throw new Error('Failed to parse RTF file: ' + error.message)
    }
  }

  const handleRtfUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.name.endsWith('.rtf')) {
        toast.error('Please upload an RTF file')
        return
    }

    setRtfFile(file)
    setStatus('Reading RTF file...')
    console.log('=== Starting RTF File Upload ===')
    console.log('File name:', file.name)

    try {
        const reader = new FileReader()
        reader.onload = async (e) => {
            try {
                console.log('=== File Loaded Successfully ===')
                const productData = await parseRtfContent(e.target.result)
                console.log('=== Parsing Complete ===')
                
                // Reset select states
                setSelectCategory("")
                setSelectSubCategory("")

                // Create a new more_details object with all the parsed fields
                const moreDetails = {
                    ...productData.more_details,
                    // Ensure all fields from foundFields are initialized
                    keyfeatures: productData.more_details.keyfeatures || '',
                    type: productData.more_details.type || '',
                    concern: productData.more_details.concern || '',
                    shelfLife: productData.more_details.shelfLife || '',
                    manufacturerdetails: productData.more_details.manufacturerdetails || '',
                    marketedby: productData.more_details.marketedby || '',
                    countryOfOrigin: productData.more_details.countryOfOrigin || '',
                    customerCare: {
                        email: productData.more_details.customerCare?.email || '',
                        phone: productData.more_details.customerCare?.phone || '',
                        address: productData.more_details.customerCare?.address || ''
                    },
                    returnPolicy: productData.more_details.returnPolicy || '',
                    seller: productData.more_details.seller || '',
                    disclaimer: productData.more_details.disclaimer || ''
                }

                // Update form data with all parsed information
                const newFormData = {
                    name: productData.name || '',
                    description: productData.description || '',
                    unit: productData.unit || '',
                    stock: productData.stock?.toString() || '',
                    price: productData.price?.toString() || '',
                    discount: productData.discount?.toString() || '',
                    category: productData.category || [],
                    subCategory: productData.subCategory || [],
                    image: productData.image || [],
                    more_details: moreDetails
                }

                // Update the form state
                setData(newFormData)

                // Update found fields to include all fields that have data
                const newFoundFields = new Set([
                    'name', 
                    'description', 
                    'unit', 
                    'stock', 
                    'price', 
                    'discount'
                ])

                // Add all fields that have data to foundFields
                Object.entries(moreDetails).forEach(([key, value]) => {
                    if (key === 'customerCare') {
                        if (Object.values(value || {}).some(v => v)) {
                            newFoundFields.add('customerCare')
                        }
                    } else if (value) {
                        newFoundFields.add(key)
                    }
                })

                setFoundFields(newFoundFields)

                console.log('=== Form Data Updated ===')
                console.log('Updated form data:', newFormData)
                console.log('Updated found fields:', Array.from(newFoundFields))

                setStatus('RTF file processed successfully')
                toast.success('RTF file processed successfully')
            } catch (error) {
                console.error('=== Error Processing RTF ===')
                console.error(error)
                toast.error('Failed to process RTF file')
                setStatus('Failed to process RTF file')
            }
        }
        reader.readAsText(file)
    } catch (error) {
        console.error('=== Error Reading RTF ===')
        console.error(error)
        toast.error('Error reading RTF file')
        setStatus('Error reading RTF file')
    }
  }

  // Function to handle field deletion
  const handleDeleteField = (fieldName) => {
    const normalizedFieldName = fieldName.toLowerCase().replace(/\s+/g, '')
    setData(prev => {
        const newData = { ...prev }
        if (fieldName in newData.more_details) {
            const { [fieldName]: deleted, ...rest } = newData.more_details
            newData.more_details = rest
        } else {
            newData[fieldName] = ''
        }
        return newData
    })
    setFoundFields(prev => {
        const newSet = new Set(prev)
        newSet.delete(normalizedFieldName)
        return newSet
    })
  }

  // useEffect(()=>{
  //   successAlert("Upload successfully")
  // },[])

  // Update the form rendering to show all fields that have data
  const renderAdditionalFields = () => {
    return Object.entries(data?.more_details || {})
        .filter(([key, value]) => {
            // Exclude description from additional fields
            if (key === 'description') return false;
            
            // For customerCare, check if any subfield has data
            if (key === 'customerCare') {
                return Object.values(value || {}).some(v => v)
            }
            // For other fields, check if the field has data and is in foundFields
            return value && foundFields.has(key)
        })
        .map(([key, value]) => {
            if (key === 'customerCare') {
                return Object.entries(value || {})
                    .filter(([_, v]) => v)
                    .map(([subKey, subValue]) => (
                        <div key={`customerCare-${subKey}`} className='grid gap-1 relative'>
                            <div className='flex justify-between items-center'>
                                <label className='font-medium'>Customer Care {subKey}</label>
                                <button
                                    type='button'
                                    onClick={() => handleDeleteField(`customerCare.${subKey}`)}
                                    className='text-red-500 hover:text-red-700'
                                >
                                    <IoClose size={20} />
                                </button>
                            </div>
                            <input 
                                type='text'
                                value={subValue}
                                onChange={(e) => {
                                    setData(prev => ({
                                        ...prev,
                                        more_details: {
                                            ...prev.more_details,
                                            customerCare: {
                                                ...prev.more_details.customerCare,
                                                [subKey]: e.target.value
                                            }
                                        }
                                    }))
                                }}
                                className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                            />
                        </div>
                    ))
            }
            // For array fields like keyfeatures
            if (Array.isArray(value)) {
                return (
                    <div key={key} className='grid gap-1 relative'>
                        <div className='flex justify-between items-center'>
                            <label className='font-medium'>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                            <button
                                type='button'
                                onClick={() => handleDeleteField(key)}
                                className='text-red-500 hover:text-red-700'
                            >
                                <IoClose size={20} />
                            </button>
                        </div>
                        <textarea 
                            value={value.join('\n')}
                            onChange={(e) => {
                                setData(prev => ({
                                    ...prev,
                                    more_details: {
                                        ...prev.more_details,
                                        [key]: e.target.value.split('\n').filter(line => line.trim())
                                    }
                                }))
                            }}
                            className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                            rows={4}
                        />
                    </div>
                )
            }
            // For regular text fields
            if (key === 'disclaimer') {
                // Special handling for disclaimer
                return (
                    <div key={key} className='grid gap-1 relative'>
                        <div className='flex justify-between items-center'>
                            <label className='font-medium'>Disclaimer</label>
                            <button
                                type='button'
                                onClick={() => handleDeleteField(key)}
                                className='text-red-500 hover:text-red-700'
                            >
                                <IoClose size={20} />
                            </button>
                        </div>
                        <textarea 
                            value={value}
                            onChange={(e) => {
                                setData(prev => ({
                                    ...prev,
                                    more_details: {
                                        ...prev.more_details,
                                        [key]: e.target.value
                                    }
                                }))
                            }}
                            className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                            rows={4}
                            style={{ whiteSpace: 'pre-wrap' }}  // Preserve whitespace and line breaks
                        />
                    </div>
                )
            }
            return (
                <div key={key} className='grid gap-1 relative'>
                    <div className='flex justify-between items-center'>
                        <label className='font-medium'>{key.replace(/([A-Z])/g, ' $1').trim()}</label>
                        <button
                            type='button'
                            onClick={() => handleDeleteField(key)}
                            className='text-red-500 hover:text-red-700'
                        >
                            <IoClose size={20} />
                        </button>
                    </div>
                    <textarea 
                        value={value}
                        onChange={(e) => {
                            setData(prev => ({
                                ...prev,
                                more_details: {
                                    ...prev.more_details,
                                    [key]: e.target.value
                                }
                            }))
                        }}
                        className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                        rows={key === 'returnPolicy' || key === 'disclaimer' ? 4 : 1}
                    />
                </div>
            )
        })
  }

  return (

    // this is upload product section , here we can upload the product images 
    <section className=''>
        <div className='p-2   bg-white shadow-md flex items-center justify-between'>
            <h2 className='font-semibold'>Upload Product</h2>
            <div className='flex gap-2'>
                <label className='px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm cursor-pointer'>
                    <FaFileAlt className='inline mr-2' />
                    Upload RTF
                    <input
                        type='file'
                        accept='.rtf'
                        onChange={handleRtfUpload}
                        className='hidden'
                    />
                </label>
            </div>
        </div>

    
        <div className='grid p-3'>
            <form className='grid gap-4' onSubmit={handleSubmit}>
                {/* Only show name field if found in RTF or manually added */}
                {foundFields.has('name') && (
                    <div className='grid gap-1 relative'>
                        <div className='flex justify-between items-center'>
                            <label htmlFor='name' className='font-medium'>Name</label>
                            {data.name && (
                                <button
                                    type='button'
                                    onClick={() => handleDeleteField('name')}
                                    className='text-red-500 hover:text-red-700'
                                >
                                    <IoClose size={20} />
                                </button>
                            )}
                        </div>
                        <input 
                            id='name'
                            type='text'
                            placeholder='Enter product name'
                            name='name'
                            value={data.name}
                            onChange={handleChange}
                            required
                            className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                        />
                    </div>
                )}

                {/* Only show description field if found in RTF or manually added */}
                {foundFields.has('description') && (
                    <div className='grid gap-1 relative'>
                        <div className='flex justify-between items-center'>
                            <label htmlFor='description' className='font-medium'>Description</label>
                            {data.description && (
                                <button
                                    type='button'
                                    onClick={() => handleDeleteField('description')}
                                    className='text-red-500 hover:text-red-700'
                                >
                                    <IoClose size={20} />
                                </button>
                            )}
                        </div>
                        <textarea 
                            id='description'
                            type='text'
                            placeholder='Enter product description'
                            name='description'
                            value={data.description}
                            onChange={handleChange}
                            required
                            multiple 
                            rows={3}
                            className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded resize-none'
                        />
                    </div>
                )}

                <div>
                    <p className='font-medium'>Image</p>
                    <div>
                      <label htmlFor='productImage' className='bg-blue-50 h-24 border rounded flex justify-center items-center cursor-pointer'>
                          <div className='text-center flex justify-center items-center flex-col'>
                            {
                              imageLoading ?  <Loading/> : (
                                <>
                                   <FaCloudUploadAlt size={35}/>
                                   <p>Upload Image</p>
                                </>
                              )
                            }
                          </div>
                          <input 
                            type='file'
                            id='productImage'
                            className='hidden'
                            accept='image/*'
                            onChange={handleUploadImage}
                          />
                      </label>
                      {/**display uploded image*/}
                      <div className='flex flex-wrap gap-4'>
                        {
                          data.image.map((img,index) =>{
                              return(
                                <div key={`image-${img}-${index}`} className='h-20 mt-1 w-20 min-w-20 bg-blue-50 border relative group'>
                                  <img
                                    src={img}
                                    alt={img}
                                    className='w-full h-full object-scale-down cursor-pointer' 
                                    onClick={()=>setViewImageURL(img)}
                                  />
                                  <div onClick={()=>handleDeleteImage(index)} className='absolute bottom-0 right-0 p-1 bg-red-600 hover:bg-red-600 rounded text-white hidden group-hover:block cursor-pointer'>
                                    <MdDelete/>
                                  </div>
                                </div>
                              )
                          })
                        }
                      </div>
                    </div>

                </div>
                <div className='grid gap-1'>
                  <label className='font-medium'>Category</label>
                  <div>
                    <select
                      className='bg-blue-50 border w-full p-2 rounded'
                      value={selectCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        const category = allCategory.find(el => el._id === value )
                        
                        setData((preve)=>{
                          return{
                            ...preve,
                            category : [...preve.category,category],
                          }
                        })
                        setSelectCategory("")
                      }}
                    >
                      <option value="">Select Category</option>
                      {allCategory.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className='flex flex-wrap gap-3'>
                      {
                        data.category.map((c,index)=>{
                          return(
                            <div key={`category-${c._id}-${index}`} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                              <p>{c.name}</p>
                              <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveCategory(index)}>
                                <IoClose size={20}/>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>
                <div className='grid gap-1'>
                  <label className='font-medium'>Sub Category</label>
                  <div>
                    <select
                      className='bg-blue-50 border w-full p-2 rounded'
                      value={selectSubCategory}
                      onChange={(e)=>{
                        const value = e.target.value 
                        const subCategory = allSubCategory.find(el => el._id === value )

                        setData((preve)=>{
                          return{
                            ...preve,
                            subCategory : [...preve.subCategory,subCategory]
                          }
                        })
                        setSelectSubCategory("")
                      }}
                    >
                      <option value="">Select Sub Category</option>
                      {allSubCategory.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <div className='flex flex-wrap gap-3'>
                      {
                        data.subCategory.map((c,index)=>{
                          return(
                            <div key={`subcategory-${c._id}-${index}`} className='text-sm flex items-center gap-1 bg-blue-50 mt-2'>
                              <p>{c.name}</p>
                              <div className='hover:text-red-500 cursor-pointer' onClick={()=>handleRemoveSubCategory(index)}>
                                <IoClose size={20}/>
                              </div>
                            </div>
                          )
                        })
                      }
                    </div>
                  </div>
                </div>

                {/* Only show unit field if found in RTF or manually added */}
                {foundFields.has('unit') && (
                    <div className='grid gap-1 relative'>
                        <div className='flex justify-between items-center'>
                            <label htmlFor='unit' className='font-medium'>Unit</label>
                            {data.unit && (
                                <button
                                    type='button'
                                    onClick={() => handleDeleteField('unit')}
                                    className='text-red-500 hover:text-red-700'
                                >
                                    <IoClose size={20} />
                                </button>
                            )}
                        </div>
                        <input 
                            id='unit'
                            type='text'
                            placeholder='Enter product unit'
                            name='unit'
                            value={data.unit}
                            onChange={handleChange}
                            required
                            className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                        />
                    </div>
                )}

                {/* Only show stock field if found in RTF or manually added */}
                {foundFields.has('stock') && (
                    <div className='grid gap-1 relative'>
                        <div className='flex justify-between items-center'>
                            <label htmlFor='stock' className='font-medium'>Number of Stock</label>
                            {data.stock && (
                                <button
                                    type='button'
                                    onClick={() => handleDeleteField('stock')}
                                    className='text-red-500 hover:text-red-700'
                                >
                                    <IoClose size={20} />
                                </button>
                            )}
                        </div>
                        <input 
                            id='stock'
                            type='number'
                            placeholder='Enter product stock'
                            name='stock'
                            value={data.stock}
                            onChange={handleChange}
                            required
                            className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                        />
                    </div>
                )}

                {/* Only show price field if found in RTF or manually added */}
                {foundFields.has('price') && (
                    <div className='grid gap-1 relative'>
                        <div className='flex justify-between items-center'>
                            <label htmlFor='price' className='font-medium'>Price</label>
                            {data.price && (
                                <button
                                    type='button'
                                    onClick={() => handleDeleteField('price')}
                                    className='text-red-500 hover:text-red-700'
                                >
                                    <IoClose size={20} />
                                </button>
                            )}
                        </div>
                        <input 
                            id='price'
                            type='text'
                            inputMode='decimal'
                            pattern='[0-9]*\.?[0-9]*'
                            placeholder='Enter product price'
                            name='price'
                            value={data.price}
                            onChange={handleChange}
                            required
                            className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                        />
                    </div>
                )}

                {/* Only show discount field if found in RTF or manually added */}
                {foundFields.has('discount') && (
                    <div className='grid gap-1 relative'>
                        <div className='flex justify-between items-center'>
                            <label htmlFor='discount' className='font-medium'>Discount</label>
                            {data.discount && (
                                <button
                                    type='button'
                                    onClick={() => handleDeleteField('discount')}
                                    className='text-red-500 hover:text-red-700'
                                >
                                    <IoClose size={20} />
                                </button>
                            )}
                        </div>
                        <input 
                            id='discount'
                            type='number'
                            placeholder='Enter product discount'
                            name='discount'
                            value={data.discount}
                            onChange={handleChange}
                            required
                            className='bg-blue-50 p-2 outline-none border focus-within:border-primary-200 rounded'
                        />
                    </div>
                )}

                {/* Render additional fields */}
                {renderAdditionalFields()}

                <div onClick={()=>setOpenAddField(true)} className='hover:bg-primary-200 bg-white py-1 px-3 w-32 text-center font-semibold border border-primary-200 hover:text-neutral-900 cursor-pointer rounded'>
                    Add Fields
                </div>

                <button className='bg-primary-100 hover:bg-primary-200 py-2 rounded font-semibold'>
                    Submit
                </button>
            </form>
        </div>

        {
          ViewImageURL && (
            <ViewImage url={ViewImageURL} close={()=>setViewImageURL("")}/>
          )
        }

        {
          openAddField && (
            <AddFieldComponent 
              value={fieldName}
              onChange={(e)=>setFieldName(e.target.value)}
              submit={handleAddField}
              close={()=>setOpenAddField(false)} 
            />
          )
        }

    </section>
  )
}

export default UploadProduct
