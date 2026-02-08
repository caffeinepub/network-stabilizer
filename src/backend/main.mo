import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization system based on callers.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile type and storage
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Network check result type
  public type NetworkCheckResult = {
    timestamp : Int;
    checkId : Nat;
    description : Text;
    errorMessages : ?Text;
    resultCode : ResultCode;
    pingTimeMs : ?Nat;
    dnsResolutionMs : ?Nat;
    testType : TestType;
  };

  public type TestType = {
    #pingTest;
    #dnsResolution;
    #throughputTest;
    #connectivityCheck : DeviceConnectivityType;
  };

  public type DeviceConnectivityType = {
    #usb;
    #wifi;
    #ethernet;
    #mobileData;
  };

  public type ResultCode = { #good; #bad; #unknown };

  module NetworkCheckResult {
    public func compare(a : NetworkCheckResult, b : NetworkCheckResult) : Order.Order {
      Int.compare(a.timestamp, b.timestamp);
    };
  };

  let userResultsMap = Map.empty<Principal, Map.Map<Int, NetworkCheckResult>>();

  // Save network check result for a user
  public shared ({ caller }) func saveNetworkCheckResult(result : NetworkCheckResult) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save network check results");
    };

    let timestamp = Time.now();

    let userMap = switch (userResultsMap.get(caller)) {
      case (null) {
        let newMap = Map.empty<Int, NetworkCheckResult>();
        userResultsMap.add(caller, newMap);
        newMap;
      };
      case (?existingMap) { existingMap };
    };

    let resultWithTimestamp = {
      result with timestamp;
    };

    userMap.add(timestamp, resultWithTimestamp);
  };

  // Retrieve all results for a user, sorted by timestamp
  public query ({ caller }) func getUserNetworkHistory(user : Principal, maxResults : ?Nat) : async [NetworkCheckResult] {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own network check history");
    };

    switch (userResultsMap.get(user)) {
      case (null) { [] };
      case (?userMap) {
        let results = userMap.values().toArray();
        let sorted = Array.sort(results, );
        let limit = switch (maxResults) {
          case (?n) { Nat.min(n, sorted.size()) };
          case (null) { Nat.min(100, sorted.size()) };
        };
        Array.tabulate<NetworkCheckResult>(limit, func(i) { sorted[i] });
      };
    };
  };

  // Clear all network results for the caller
  public shared ({ caller }) func clearNetworkHistory() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can clear network check history");
    };
    userResultsMap.remove(caller);
  };
};
