import { useState } from 'react'

import { trpc } from '../../utils/trpc';
import { ReportReason } from '@prisma/client';
import { useRouter } from 'next/router';


export default function Chat() {

  const reportUser = trpc.report.reportUser.useMutation()

  const reportButton = (reason: ReportReason) => {
    reportUser.mutate({ userId: "cldfh7fo50000rrzi4lcne0jd", reason: reason });
  };

  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedValue, setSelectedValue] = useState<ReportReason>(ReportReason.SPAM);

  const router = useRouter();

  const handleClick = (e: { preventDefault: () => void; }, route: string) => {
    e.preventDefault()
    router.push(route)
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMessages([...messages, input]);
    setInput('');
  };

  return (
    <div className="h-screen w-screen flex flex-col">
      <div className="h-84 w-84 mt-10 ml-10">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 flex items-center justify-center rounded bottom-0 left-0 right-0" onClick={(e) => handleClick(e, '/dashboard')}>
          Return
        </button>
      </div>
      <div className="flex-1 overflow-y-scroll p-4">
        {messages.map((message, index) => (
          <div key={index} className="p-4 bg-white">
            {message}
          </div>
        ))}
      </div>
      {isDropdownOpen && (
        <div className="bg-white rounded p-2">
          <button
            className="p-2 bg-blue-500 text-white rounded mr-2"
            onClick={() => {
              setIsDropdownOpen(false);
              setIsModalOpen(true);
              setSelectedOption(1);
            }}
          >
            Contract
          </button>
          <button
            className="p-2 bg-blue-500 text-white rounded mr-2"
            onClick={() => {
              setIsDropdownOpen(false);
              setIsModalOpen(true);
              setSelectedOption(2);
            }}
          >
            Upload
          </button>
          <button
            className="p-2 bg-red-500 text-white rounded"
            onClick={() => {
              setIsDropdownOpen(false);
              setIsModalOpen(true);
              setSelectedOption(3);
            }}
          >
            Report
          </button>
        </div>
      )}

      {isModalOpen && selectedOption === 1 && (
        <div className="fixed bottom-0 left-0 right-0 top-0 bg-gray-900 opacity-75">
          <div className="m-auto bg-white rounded p-4">
            <h3 className="text-lg mb-2">Contract Offer</h3>
            <div className="mb-4">
              <label className="text-gray-600">Lodging:</label>
              <input
                type="text"
                className="w-full bg-white p-2 rounded ml-4" />
            </div>
            <div className="mb-4">
              <label className="text-gray-600">Price:</label>
              <input
                type="text"
                className="w-full bg-white p-2 rounded ml-4" />
            </div>
            <div className="mb-4">
              <label className="text-gray-600">Duration:</label>
              <input
                type="text"
                className="w-full bg-white p-2 rounded ml-4" />
            </div>
            <div className="flex justify-end">
              <button
                className="p-2 bg-blue-500 text-white rounded mr-2"
                onClick={() => setIsModalOpen(false)}
              >
                Confirm
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedOption === 3 && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-200">
          <div className="p-4 m-auto bg-white rounded">
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Report type:
              </label>
              <select
                value={selectedOption}
                onChange={(event) => setSelectedValue(event.target.value as ReportReason)}
                className="w-full bg-white p-2 rounded"
              >
                <option value="SPAM">SPAM</option>
                <option value="INAPPROPRIATE">INAPPROPRIATE</option>
                <option value="SCAM">SCAM</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="p-2 bg-blue-500 text-white rounded mr-2"
                onClick={() => {
                  reportButton(selectedValue);
                  setIsModalOpen(false);
                }}
              >
                Confirm
              </button>
              <button
                className="p-2 bg-red-500 text-white rounded"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-gray-200 p-4">
        <div className="flex items-center">
          <button
            className="p-2 bg-blue-500 text-white rounded"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Options
          </button>
          <input
            placeholder="Enter message..."
            className="w-full bg-white p-2 rounded ml-4"
            value={input}
            onChange={(event) => setInput(event.target.value)} />
          <button className="ml-4 p-2 bg-blue-500 text-white rounded">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
