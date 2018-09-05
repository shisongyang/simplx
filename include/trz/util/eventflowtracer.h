/**
 * @file eventflowtracer.h
 */

#pragma once

#include <stack>
#include <map>
#include <list>
#include <iostream>
#include <functional>
#include <unordered_map>
#include <typeinfo>
#include <typeindex>

namespace tredzone
{
std::string cppDemangledTypeInfoName(const std::type_info &typeInfo);

template <typename _AsyncNode, typename _Actor>
struct EventFlowTracer_t
{
    struct Hook
    {
        _AsyncNode* pNode;

		int64_t id;
		int64_t parentId;
		const std::type_index signalType;
 	    void* signalAddr;
		_Actor* srcActorAddr;
		_Actor* dstActorAddr;
		typename _Actor::ActorId srcActorId;
		typename _Actor::ActorId dstActorId;
		uint64_t srcLoop;
		uint64_t dstLoop;
		std::type_index srcActorType=typeid(void);
		std::type_index dstActorType=typeid(void);
		
        Hook(_AsyncNode* pNode, const std::type_info& EvtTypeInfo, int64_t id, int64_t parentId):pNode(pNode), signalType(EvtTypeInfo), id(id), parentId(parentId)
        {}
    };
    void print(std::string str)
    {
        std::cout << std::string(hookStack.size(),' ') << str << std::endl;
    }
    void onHookStop()
    {
		std::string signal;
		if (hookStack.top().signalType == typeid(typename _Actor::Event)) signal = "Event";
		else if (hookStack.top().signalType == typeid(typename _Actor::Callback)) signal = "Callback";
		else if (hookStack.top().signalType == typeid(typename _Actor::Event::Pipe)) signal = "Push";
		else signal = "Constructor";
			
		std::ostringstream oss;
		oss << "On" << signal << "Hook(" << hookStack.top().id << ")" << std::endl;
		oss << " parentId     " << hookStack.top().parentId << std::endl;
		oss << " signalAddr   " << hookStack.top().signalAddr << std::endl;
		oss << " srcLoop      " << hookStack.top().srcLoop << std::endl;
		oss << " dstLoop      " << hookStack.top().dstLoop << std::endl;
		oss << " srcActorType " << hookStack.top().srcActorType.name() << std::endl;
		oss << " dstActorType " << hookStack.top().dstActorType.name() << std::endl;
		oss << " srcActorId   " << hookStack.top().srcActorId << std::endl;
		oss << " dstActorId   " << hookStack.top().dstActorId << std::endl;
		oss << " srcActorAddr " << hookStack.top().srcActorAddr << std::endl;
		oss << " dstActorAddr " << hookStack.top().dstActorAddr << std::endl;

		print(oss.str());

	}
	template <typename _Event> 
    static EventFlowTracer_t* OnEventHookStart(_AsyncNode* pNode, _Event* pEvent, _Actor* pActor)
    {
        get(pNode)->hookStack.emplace(pNode,typeid(typename _Actor::Event),++get(pNode)->id, get(pNode)->hookStack.size()?get(pNode)->hookStack.top().id:-1L);
		get(pNode)->hookStack.top().signalAddr = const_cast<void*>(static_cast<const void*>(pEvent));
		get(pNode)->hookStack.top().dstActorAddr = pActor;
		get(pNode)->hookStack.top().dstActorId = pActor->getActorId();
		get(pNode)->hookStack.top().dstLoop = (uint64_t)pActor->getCorePerformanceCounters().getLoopTotalCount();
		get(pNode)->hookStack.top().dstActorType = typeid(*pActor);
        get(pNode)->hookStack.top().srcActorId = pEvent->getSourceActorId();
        get(pNode)->hookStack.top().srcActorAddr = nullptr;
        get(pNode)->hookStack.top().srcLoop = 0;
        return get(pNode);
    }
    void OnEventHookStop()
    {
        onHookStop();
        hookStack.pop();
    }
    template <typename _Callback> 
    static EventFlowTracer_t* OnCallbackHookStart(_AsyncNode* pNode, _Callback* pCallback, _Actor* pActor)
    {
		get(pNode)->hookStack.emplace(pNode,typeid(typename _Actor::Callback),++get(pNode)->id, get(pNode)->hookStack.size()?get(pNode)->hookStack.top().id:-1L);

		get(pNode)->hookStack.top().signalAddr = pCallback;
		get(pNode)->hookStack.top().dstActorAddr = pActor;
		get(pNode)->hookStack.top().dstActorId = pActor->getActorId();
		get(pNode)->hookStack.top().dstLoop = (uint64_t)pActor->getCorePerformanceCounters().getLoopTotalCount();
		get(pNode)->hookStack.top().dstActorType = typeid(*pActor);
		
        const auto& it = get(pNode)->lastRegisterCallbackMap.find(pCallback);
        if (it!=get(pNode)->lastRegisterCallbackMap.end())
        {
			it->second(get(pNode));
			get(pNode)->lastRegisterCallbackMap.erase(it);
		}
        return get(pNode);
    }
    void OnCallbackHookStop()
    {
        onHookStop();
        hookStack.pop();
    }
    static EventFlowTracer_t* OnConstructorHookStart(_AsyncNode* pNode, _Actor* pActor)
    {
        get(pNode)->hookStack.emplace(pNode,typeid(Actor),++get(pNode)->id, get(pNode)->hookStack.size()?get(pNode)->hookStack.top().id:-1L);
        if (!pActor) return get(pNode);
     
		get(pNode)->hookStack.top().signalAddr = nullptr;
		get(pNode)->hookStack.top().srcActorAddr = pActor;
		get(pNode)->hookStack.top().srcActorId = pActor->getActorId();
		get(pNode)->hookStack.top().srcLoop = (uint64_t)pActor->getCorePerformanceCounters().getLoopTotalCount();
		get(pNode)->hookStack.top().srcActorType = typeid(*pActor);
		
        return get(pNode);
    }
    void OnConstructorHookStop(_Actor* pNewActor)
    {
        hookStack.top().dstActorAddr = pNewActor;
        hookStack.top().dstActorId = pNewActor->getActorId();
		hookStack.top().dstLoop = (uint64_t)pNewActor->getCorePerformanceCounters().getLoopTotalCount();
		hookStack.top().dstActorType = typeid(*pNewActor);
		        
        onHookStop();
        hookStack.pop();
    }
    template <typename _Event> 
    static void OnPushHook(_AsyncNode* pNode, _Event* pEvent, _Actor* pActor)
    {
        if (!get(pNode)->hookStack.size()) return;
        
		get(pNode)->hookStack.emplace(pNode,typeid(typename _Actor::Event::Pipe),++get(pNode)->id, get(pNode)->hookStack.size()?get(pNode)->hookStack.top().id:-1L);
		get(pNode)->hookStack.top().signalAddr = pEvent;
		get(pNode)->hookStack.top().srcLoop = (uint64_t)pActor->getCorePerformanceCounters().getLoopTotalCount();
		get(pNode)->hookStack.top().dstLoop = 0;
		get(pNode)->hookStack.top().srcActorAddr = pActor;
		get(pNode)->hookStack.top().dstActorAddr = nullptr;
		get(pNode)->hookStack.top().srcActorId = pActor->getActorId();
		get(pNode)->hookStack.top().dstActorId = pEvent->getDestinationActorId();
		get(pNode)->hookStack.top().srcActorType = typeid(*pActor);
		get(pNode)->onHookStop();
		get(pNode)->hookStack.pop();       
    }
    template <typename _Callback> 
    static void OnRegisterCallbackHook(_AsyncNode* pNode, _Callback* pCallback, _Actor* pActor)
    {
        if (!get(pNode)->hookStack.size()) return;
		uint64_t loop = (uint64_t)pActor->getCorePerformanceCounters().getLoopTotalCount();
        get(pNode)->lastRegisterCallbackMap[pCallback] = [pNode, pCallback, pActor, loop](EventFlowTracer_t* eft)
        {
            eft->hookStack.top().srcLoop = loop;
            eft->hookStack.top().srcActorAddr = pActor;
            eft->hookStack.top().srcActorId = pActor->getActorId();
            eft->hookStack.top().srcActorType = typeid(*pActor);
        };
    }
    uint64_t id;
    std::stack<Hook, std::list<Hook>> hookStack;
	std::map<const void*,std::function<void (EventFlowTracer_t*)>> lastRegisterCallbackMap;
    static EventFlowTracer_t* get(_AsyncNode* pNode);
    
    
    
};

}// namespace tredzone

