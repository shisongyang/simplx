/*
 * main.cpp
 *
 * This tutorial will demonstrate how to start Actors and how they communicate.
 * A Service will be used to easily find the PrinterActor.
 * The PrinterActor will be instantiated and will be waiting to receive PrintEvents.
 * Several WriterActors will be started and will send a PrintEvent to the PrinterActor.
 */

#include <iostream>
#include <simplx.h>

using namespace tredzone;

struct MyEvent : Actor::Event {
	MyEvent()  {
	}
};



struct PrintEvent : Actor::Event {
	PrintEvent(const std::string& message) : message(message) {
	}
	const std::string message;
};
struct OtherEvent : Actor::Event {
	OtherEvent(const std::string& message) : message(message) {
		
	}
	const std::string message;
};

struct DumpActor : Actor, Actor::Callback{
	long i;
	DumpActor() : i(0)
	{
		registerCallback(*this);
	}
    
	void onCallback() {
		
		/*
			++i;
			registerCallback(*this);

			

			if (i==100*((uint64_t)getActorId().getNodeId()+1))
			{
					for (std::list<std::string>& jsonList = getDbgEvtMgr().jsonList; jsonList.begin()!=jsonList.end() ; jsonList.pop_front())
					{
						std::cout << jsonList.front();
					}
			}
	
			if (i==1000*((uint64_t)getActorId().getNodeId()+1))
			{		
				std::string coreColor[]= {"0.6 0.2 0.8","0.4 0.1 0.9","0.9 0.1 0.9"};

			//	std::cout << "digraph trz {\n"
				std::cout << "node [style=filled fontsize=\"9\" fillcolor=\"" << coreColor[(uint64_t)getActorId().getNodeId()] << "\"]\n"
				"edge [fontsize=\"8\" fontname=\"Helvetica-Oblique\"]\n";
				for (std::set<std::string>& graphVizSet = getDbgEvtMgr().graphVizSet; graphVizSet.begin()!=graphVizSet.end() ; graphVizSet.erase(graphVizSet.begin()))
				{
					if (graphVizSet.begin()->find("::DestroyEventActor")!=std::string::npos) continue;
					if (graphVizSet.begin()->find("DefaultCoreActor")!=std::string::npos) continue;
					if (graphVizSet.begin()->find("ServiceSingletonActor")!=std::string::npos) continue;
					std::cout << *(graphVizSet.begin());
				}
			//	std::cout << "}\n";
			}
			*/
			
		}
};

struct TestActorService : AsyncService {
};
struct TotoActor : Actor, Actor::Callback {
void onCallback() {
					const ActorId& testActorId = getEngine().getServiceIndex().getServiceActorId<TestActorService>();
				Event::Pipe pipe(*this, testActorId);
				pipe.push<MyEvent>();
}
	TotoActor ()
	{
				registerCallback(*this);
	
	}
};

struct TestActor : Actor{
	TestActor()
	{
		registerEventHandler<MyEvent>(*this);
		newUnreferencedActor<TotoActor>();
	}

	void onEvent(const MyEvent& event) {


	}
};


struct PrinterActor : Actor, Actor::Callback  {
	/**
	 * The Service Tag that will be used to index the PrinterActor service
	 */
	struct Service : AsyncService {
	};
	int i;
	PrinterActor():i(0) {
		
		registerEventHandler<PrintEvent>(*this);	// The Actor will expect to receive a PrintEvent
		registerEventHandler<OtherEvent>(*this);	// The Actor will expect to receive a PrintEvent
		registerCallback(*this);

		newUnreferencedActor<TestActor>();
		newUnreferencedActor<TotoActor>();

	}

	/**
	 * Callback method that will called when the PrintEvent is received
	 */
	void onEvent(const PrintEvent& event) {
			const ActorId& printerActorId = getEngine().getServiceIndex().getServiceActorId<PrinterActor::Service>();
			Event::Pipe pipe(*this, printerActorId);	
			pipe.push<OtherEvent>("Hello 3");	
	}
	void onEvent(const OtherEvent& event) {
}
	void onCallback() {
		++i;
		registerCallback(*this);

			const ActorId& testActorId = getEngine().getServiceIndex().getServiceActorId<TestActorService>();
			Event::Pipe pipe(*this, testActorId);	
			pipe.push<MyEvent>();	

		if (i==8) 
		{
			const ActorId& printerActorId = getEngine().getServiceIndex().getServiceActorId<PrinterActor::Service>();
			Event::Pipe pipe(*this, printerActorId);	
			pipe.push<PrintEvent>("Hello 2");		
			return ;
		}
		
	}
};

/**
 * WriterActor will send a PrintEvent with a given string message to the PrinterActor
 */
struct WriterActor : Actor {
	WriterActor() {
		const ActorId& printerActorId = getEngine().getServiceIndex().getServiceActorId<PrinterActor::Service>();	// Retrieve PrinterActor's address from the ServiceIndex
		Event::Pipe pipe(*this, printerActorId);	// Create a uni-directional communication channel between the WriterActor (this), and the PrinterActor (printerActorId)
		pipe.push<PrintEvent>("Hello, World!");		// Send the PrintEvent using the previously created pipe


			const ActorId& testActorId = getEngine().getServiceIndex().getServiceActorId<TestActorService>();
			Event::Pipe pipe2(*this, testActorId);	
			pipe2.push<MyEvent>();	
	}
};



int main() {
    Engine::StartSequence startSequence;	// Configure the initial Actor system
    // the addServiceActor and addActor methods take as first argument the CoreId (cpu core) on which the Actor will be running
    startSequence.addServiceActor<PrinterActor::Service, PrinterActor>(0);
	
	startSequence.addServiceActor<TestActorService, TestActor>(2);
    startSequence.addActor<WriterActor>(0);
    startSequence.addActor<WriterActor>(1);
	startSequence.addActor<WriterActor>(2);
    startSequence.addActor<DumpActor>(0);
    startSequence.addActor<DumpActor>(1);
    startSequence.addActor<DumpActor>(2);
    Engine engine(startSequence);	// Start all the actors

    sleep(2);

    return 0;
}
