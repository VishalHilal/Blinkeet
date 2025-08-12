import React, { useEffect, useState } from 'react'
import UploadSubCategoryModel from '../components/UploadSubCategoryModel'
import AxiosToastError from '../utils/AxiosToastError'
import Axios from '../utils/Axios'
import SummaryApi from '../common/SummaryApi'
import DisplayTable from '../components/DisplayTable'
import { createColumnHelper } from '@tanstack/react-table'
import ViewImage from '../components/ViewImage'
import { MdDelete } from "react-icons/md"
import { HiPencil } from "react-icons/hi"
import EditSubCategory from '../components/EditSubCategory'
import CofirmBox from '../components/CofirmBox'
import toast from 'react-hot-toast'

const SubCategoryPage = () => {
  const [openAddSubCategory, setOpenAddSubCategory] = useState(false)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const columnHelper = createColumnHelper()
  const [ImageURL, setImageURL] = useState("")
  const [openEdit, setOpenEdit] = useState(false)
  const [editData, setEditData] = useState({ _id: "" })
  const [deleteSubCategory, setDeleteSubCategory] = useState({ _id: "" })
  const [openDeleteConfirmBox, setOpenDeleteConfirmBox] = useState(false)

  const fetchSubCategory = async () => {
    try {
      setLoading(true)
      const response = await Axios({ ...SummaryApi.getSubCategory })
      const { data: responseData } = response

      if (responseData.success) {
        setData(responseData.data)
      }
    } catch (error) {
      AxiosToastError(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubCategory()
  }, [])

  const column = [
    columnHelper.accessor('name', {
      header: "Name"
    }),
    columnHelper.accessor('image', {
      header: "Image",
      cell: ({ row }) => (
        <div className='flex justify-center items-center'>
          <img
            src={row.original.image}
            alt={row.original.name}
            className='w-10 h-10 rounded-md object-cover cursor-pointer shadow'
            onClick={() => setImageURL(row.original.image)}
          />
        </div>
      )
    }),
    columnHelper.accessor("category", {
      header: "Category",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.category.map((c, index) => (
            <span key={c._id + "table"} className='bg-slate-100 border px-2 py-0.5 rounded text-sm'>
              {c.name}
            </span>
          ))}
        </div>
      )
    }),
    columnHelper.accessor("_id", {
      header: "Action",
      cell: ({ row }) => (
        <div className='flex items-center justify-center gap-3'>
          <button
            onClick={() => {
              setOpenEdit(true)
              setEditData(row.original)
            }}
            className='p-2 bg-emerald-100 rounded-full text-emerald-600 hover:bg-emerald-200 transition'
          >
            <HiPencil size={18} />
          </button>
          <button
            onClick={() => {
              setOpenDeleteConfirmBox(true)
              setDeleteSubCategory(row.original)
            }}
            className='p-2 bg-rose-100 rounded-full text-rose-500 hover:bg-rose-200 transition'
          >
            <MdDelete size={18} />
          </button>
        </div>
      )
    })
  ]

  const handleDeleteSubCategory = async () => {
    try {
      const response = await Axios({
        ...SummaryApi.deleteSubCategory,
        data: deleteSubCategory
      })

      const { data: responseData } = response

      if (responseData.success) {
        toast.success(responseData.message)
        fetchSubCategory()
        setOpenDeleteConfirmBox(false)
        setDeleteSubCategory({ _id: "" })
      }
    } catch (error) {
      AxiosToastError(error)
    }
  }

  return (
    <section className=''>
      <div className='p-4 bg-white border-b flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-gray-700'>Sub Categories</h2>
        <button
          onClick={() => setOpenAddSubCategory(true)}
          className='text-sm px-4 py-1.5 rounded bg-primary-600 text-white hover:bg-primary-700 transition'
        >
          Add Sub Category
        </button>
      </div>

      <div className='overflow-auto w-full max-w-[95vw] p-2'>
        <DisplayTable data={data} column={column} />
      </div>

      {openAddSubCategory && (
        <UploadSubCategoryModel
          close={() => setOpenAddSubCategory(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {ImageURL && (
        <ViewImage url={ImageURL} close={() => setImageURL("")} />
      )}

      {openEdit && (
        <EditSubCategory
          data={editData}
          close={() => setOpenEdit(false)}
          fetchData={fetchSubCategory}
        />
      )}

      {openDeleteConfirmBox && (
        <CofirmBox
          cancel={() => setOpenDeleteConfirmBox(false)}
          close={() => setOpenDeleteConfirmBox(false)}
          confirm={handleDeleteSubCategory}
        />
      )}
    </section>
  )
}

export default SubCategoryPage
