// import React, { useState } from "react";

// function Dialog({ Children }) {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <>
//       <button
//         className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
//         onClick={() => setIsOpen(true)}
//       >
//         Open Dialog
//       </button>

//       {isOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300 z-50">
//           <div className="bg-white p-8 rounded shadow-lg transition-all transform duration-300 scale-100">
//             <button
//               className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//               onClick={() => setIsOpen(false)}
//             >
//               Close Dialog
//             </button>
//             {Children}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// export default Dialog;

import React, { useState } from "react";
function Dialog({ children }) {
  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center transition-opacity duration-300 z-50">
        <div className=" shadow-lg transition-all transform duration-300 scale-100">
          {children}
        </div>
      </div>
    </>
  );
}

export default Dialog;
