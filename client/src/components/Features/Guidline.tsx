import { FileQuestion, Play, Upload, Zap } from 'lucide-react';
import SubTitle from '../Home/SubTitle';

export default function Guideline() {
  return (
    <div className="p-8 my-15">
      <div className="max-w-7xl mx-auto">

        <SubTitle title1="Explore more" title2="Features" description="Everything you need to explore with issue tracker"/>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Step</span>
                <div className="w-6 h-6 rounded-full border-2 border-gray-800 flex items-center justify-center">
                  <span className="text-xs font-bold">1</span>
                </div>
              </div>
              <h2 className="text-2xl font-bold">Crate your issue</h2>
              <p className="text-gray-600 text-sm">
                Start from issue with simple form design.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-sm">
              <p className="text-center text-gray-700 text-sm">
                Upload your issue details or describe your issue in natural language.
              </p>
            </div>

            <div className="flex items-center justify-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="w-16 h-0.5 bg-gray-300"></div>
              <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center text-sm font-bold">
                4
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <Upload className="w-5 h-5 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">You</h3>
                  <p className="text-sm text-gray-600">
                    Fill the form with assigning issues.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <Zap className="w-5 h-5 mt-1 shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Issue Tracker</h3>
                  <p className="text-sm text-gray-600">
                    Issue make with all details without missing.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="relative bg-gray-900 rounded-lg overflow-hidden aspect-video shadow-lg">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white/20 bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center transition-all">
                  <Play className='text-white'/>
                </button>
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black to-transparent p-4">
                <div className="flex items-center gap-3">
                  <button className="text-white hover:text-gray-300">
                    <div className="w-3 h-3 bg-white"></div>
                  </button>
                  <button className="text-white hover:text-gray-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" />
                    </svg>
                  </button>
                  
                  <div className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
                    <div className="h-full w-2/5 bg-red-600"></div>
                  </div>
                  
                  <span className="text-white text-xs font-mono">2:34 / 5:49</span>
                  
                  <button className="text-white hover:text-gray-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                  </button>
                  
                  <button className="text-white hover:text-gray-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01-1.414 1.414L5 6.414V8a1 1 0 01-2 0V4zm9 1a1 1 0 110-2h4a1 1 0 011 1v4a1 1 0 11-2 0V6.414l-2.293 2.293a1 1 0 11-1.414-1.414L13.586 5H12zm-9 7a1 1 0 112 0v1.586l2.293-2.293a1 1 0 011.414 1.414L6.414 15H8a1 1 0 110 2H4a1 1 0 01-1-1v-4zm13-1a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 110-2h1.586l-2.293-2.293a1 1 0 011.414-1.414L15 13.586V12a1 1 0 011-1z" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="absolute top-4 right-4">
                <button className="w-6 h-6 bg-gray-100 bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-black">
                   <FileQuestion size={15}/>
                </button>
              </div>
            </div>

            <div className="text-center space-y-2">
              <button className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:gap-3 transition-all">
                Start with your first issue
                <span>→</span>
              </button>
              <p className="text-sm text-gray-600">
                Create a free account and create your work space.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
