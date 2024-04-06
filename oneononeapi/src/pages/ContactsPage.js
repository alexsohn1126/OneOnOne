export default function ContactsPage() {
    return (
        <>
        <body class="min-h-screen relative pb-12">


    <div id="content-wrap" class="pt-32 pb-44 text-center">

<div class="p-4 rounded-lg shadow mx-auto my-8 max-w-4xl">
    <div class="mb-8">
        <label for="User">Search for user</label>
        <br/>
        <input type="email" class="py-1 px-1 border border-black rounded-xl"/>
    </div>

    <form action="#addContactModal">
        <button
            class="py-8 px-8 mb-8 max-w-md mx-auto bg-green-3 hover:bg-green-2 rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="white" class="w-12 h-12">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>

            <div class="text-center sm:text-left mt-4 sm:mt-0">
                <p class="text-xl text-white font-semibold">
                    Add contact
                </p>
            </div>
        </button>
    </form>

    <div
        class="py-8 px-8 mb-8 max-w-md mx-auto rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 relative border border-gray-300">

        <div
            class=" mx-auto h-24 w-24 rounded-full sm:mx-0 sm:shrink-0 inline-flex items-center justify-center text-purple-600 text-2xl font-semibold border border-black">
            J
        </div>

        <div class="text-center sm:text-left mt-4 sm:mt-0">
            <p class="text-lg text-black font-semibold">
                John Doe
            </p>
            <p class="text-gray-700">
                <a class="break-all hover:bg-green-500" href="mailto:john@gmail.com">johndoe@gmail.com</a>
            </p>
        </div>


        <div class="absolute right-2 top-2">
            <button
                class=" py-2 px-4 mx-0  inline-flex items-end h-10 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:fill-green-1">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                  </svg>
            </button>
        </div>

        

    </div>


    <div
        class="py-8 px-8 mb-8 max-w-md mx-auto border-gray-300 rounded-xl shadow-lg space-y-2 sm:py-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-6 relative border border-gray-300">

        <div
            class=" mx-auto h-24 w-24 rounded-full sm:mx-0 sm:shrink-0 inline-flex items-center justify-center text-purple-600 text-2xl font-semibold border border-black">
            J
        </div>

        <div class="text-center sm:text-left mt-4 sm:mt-0">
            <p class="text-lg text-black font-semibold">
                Jane Doe
            </p>
            <p class="text-gray-700">
                <a class="break-all hover:bg-green-500" href="mailto:janedoe@gmail.com">janedoe@gmail.com</a>
            </p>
        </div>


        <div class="absolute right-2 top-2">
            <button
                class=" py-2 px-4 mx-0  inline-flex items-end h-10 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 hover:fill-green-1">
                    <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32L19.513 8.2Z" />
                  </svg>
            </button>
        </div>

    </div>

    
    </div>

</div>

<footer class="absolute bottom-0 min-w-full text-center h-12 bg-footer flex justify-center items-center text-white">
            <p>Copyright &copy; 2024</p>
        </footer>


        </body>
        </>
    )
}