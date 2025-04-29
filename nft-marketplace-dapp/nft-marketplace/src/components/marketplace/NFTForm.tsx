// // src/components/marketplace/NFTForm.tsx
// import React, { useState } from 'react';
// import { Formik, Form, Field, ErrorMessage } from 'formik';
// import * as Yup from 'yup';
// import Button from '../common/Button';
// import { useNFT } from '../../hooks/useNFT';
// import { toast } from 'react-toastify';

// const validationSchema = Yup.object({
//   name: Yup.string().required('Name is required'),
//   description: Yup.string().required('Description is required'),
//   image: Yup.mixed().required('Image is required'),
// });

// const NFTForm: React.FC = () => {
//   const { createNFT, isLoading, error } = useNFT();
//   const [preview, setPreview] = useState<string | null>(null);

//   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setFieldValue('image', file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (values: any, { resetForm }: any) => {
//     try {
//       const attributes = [
//         { trait_type: 'Type', value: values.type || 'Art' },
//         { trait_type: 'Rarity', value: values.rarity || 'Common' },
//       ];

//       const result = await createNFT(
//         values.name,
//         values.description,
//         values.image,
//         attributes
//       );

//       if (result) {
//         toast.success('NFT created successfully!');
//         resetForm();
//         setPreview(null);
//       } else {
//         toast.error('Failed to create NFT');
//       }
//     } catch (err) {
//       toast.error('Error creating NFT');
//       console.error(err);
//     }
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md p-6">
//       {/* <h2 className="text-2xl font-bold mb-6">Create New NFT</h2> */}
//       <Formik
//         initialValues={{
//           name: '',
//           description: '',
//           image: undefined,
//           type: 'Art',
//           rarity: 'Common',
//         }}
//         validationSchema={validationSchema}
//         onSubmit={handleSubmit}
//       >
//         {({ setFieldValue, errors, touched }) => (
//           <Form className="space-y-6">
//             <div>
//               <label htmlFor="name" className="block  text-sm font-medium text-black mb-1">
//                 Name
//               </label>
//               <Field
//                 type="text"
//                 name="name"
//                 id="name"
//                 className="w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//               <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
//             </div>

//             <div>
//               <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
//                 Description
//               </label>
//               <Field
//                 as="textarea"
//                 name="description"
//                 id="description"
//                 rows={4}
//                 className="w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//               />
//               <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
//             </div>

//             <div>
//               <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
//                 Image
//               </label>
//               <input
//                 type="file"
//                 id="image"
//                 name="image"
//                 accept="image/*"
//                 onChange={(e) => handleImageChange(e, setFieldValue)}
//                 className="w-full text-sm text-gray-500
//                   file:mr-4 file:py-2 file:px-4
//                   file:rounded-md file:border-0
//                   file:text-sm file:font-semibold
//                   file:bg-blue-50 file:text-blue-700
//                   hover:file:bg-blue-100"
//               />
//               {errors.image && touched.image && (
//                 <p className="mt-1 text-sm text-red-600">{errors.image as string}</p>
//               )}
//               {preview && (
//                 <div className="mt-3">
//                   <img
//                     src={preview}
//                     alt="Preview"
//                     className="h-40 w-40 object-cover rounded-lg"
//                   />
//                 </div>
//               )}
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
//                   Type
//                 </label>
//                 <Field
//                   as="select"
//                   name="type"
//                   id="type"
//                   className="w-full text-black rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 >
//                   <option value="Art">Art</option>
//                   <option value="Music">Music</option>
//                   <option value="Photography">Photography</option>
//                   <option value="Collectible">Collectible</option>
//                   <option value="Domain">Domain</option>
//                   <option value="Virtual World">Virtual World</option>
//                 </Field>
//               </div>

//               <div>
//                 <label htmlFor="rarity" className="block text-sm font-medium text-gray-700 mb-1">
//                   Rarity
//                 </label>
//                 <Field
//                   as="select"
//                   name="rarity"
//                   id="rarity"
//                   className="w-full rounded-lg text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
//                 >
//                   <option value="Common">Common</option>
//                   <option value="Uncommon">Uncommon</option>
//                   <option value="Rare">Rare</option>
//                   <option value="Epic">Epic</option>
//                   <option value="Legendary">Legendary</option>
//                 </Field>
//               </div>
//             </div>

//             {error && <p className="text-red-600 text-sm">{error}</p>}

//             <Button
//               type="submit"
//               variant="primary"
//               className="w-full"
//               isLoading={isLoading}
//             >
//               Create NFT
//             </Button>
//           </Form>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default NFTForm;





// src/components/marketplace/NFTForm.tsx
import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Button from '../common/Button';
import { useNFT } from '../../hooks/useNFT';
import { toast } from 'react-toastify';

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  description: Yup.string().required('Description is required'),
  image: Yup.mixed().required('Image is required'),
});

const NFTForm: React.FC = () => {
  const { createNFT, isLoading, error } = useNFT();
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setFieldValue('image', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    try {
      const attributes = [
        { trait_type: 'Type', value: values.type || 'Art' },
        { trait_type: 'Rarity', value: values.rarity || 'Common' },
      ];

      const result = await createNFT(
        values.name,
        values.description,
        values.image,
        attributes
      );

      if (result) {
        toast.success('NFT created successfully!');
        resetForm();
        setPreview(null);
      } else {
        toast.error('Failed to create NFT');
      }
    } catch (err) {
      toast.error('Error creating NFT');
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      {/* <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-3">Create New NFT</h2> */}
      <Formik
        initialValues={{
          name: '',
          description: '',
          image: undefined,
          type: 'Art',
          rarity: 'Common',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <Field
                type="text"
                name="name"
                id="name"
                placeholder="Enter NFT name"
                className="w-full rounded-lg text-black border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition duration-200"
              />
              <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                id="description"
                placeholder="Describe your NFT"
                rows={4}
                className="w-full rounded-lg text-black border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition duration-200"
              />
              <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-semibold text-gray-700 mb-2">
                Image
              </label>
              <div className="flex items-center justify-center w-full">
                <label
                  className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-200 ${
                    preview ? 'border-blue-400' : 'border-gray-300'
                  }`}
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-3 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    <p className="mb-1 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e, setFieldValue)}
                    className="hidden"
                  />
                </label>
              </div>
              {errors.image && touched.image && (
                <p className="mt-1 text-sm text-red-600">{errors.image as string}</p>
              )}
              {preview && (
                <div className="mt-4 flex justify-center">
                  <div className="relative group">
                    <img
                      src={preview}
                      alt="Preview"
                      className="h-48 w-48 object-cover rounded-lg shadow-md border-2 border-blue-200"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreview(null);
                        setFieldValue('image', undefined);
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hidden group-hover:block"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <Field
                  as="select"
                  name="type"
                  id="type"
                  className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition duration-200 appearance-none bg-white"
                >
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Photography">Photography</option>
                  <option value="Collectible">Collectible</option>
                  <option value="Domain">Domain</option>
                  <option value="Virtual World">Virtual World</option>
                </Field>
              </div>

              <div>
                <label htmlFor="rarity" className="block text-sm font-semibold text-gray-700 mb-2">
                  Rarity
                </label>
                <Field
                  as="select"
                  name="rarity"
                  id="rarity"
                  className="w-full rounded-lg text-black border border-gray-300 px-4 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-30 transition duration-200 appearance-none bg-white"
                >
                  <option value="Common">Common</option>
                  <option value="Uncommon">Uncommon</option>
                  <option value="Rare">Rare</option>
                  <option value="Epic">Epic</option>
                  <option value="Legendary">Legendary</option>
                </Field>
              </div>
            </div>

            {error && <p className="text-red-600 text-sm bg-red-50 p-3 rounded-md">{error}</p>}

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                className="w-full py-3 text-lg font-medium transition-transform duration-200 transform hover:scale-[1.02]"
                isLoading={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create NFT'}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NFTForm;